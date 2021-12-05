declare var process: {
  env: {
    MONGO_HOST: string,
    MONGO_DB: string,
    MONGO_GTFS_DB: string,
    NODE_ENV: 'development' | 'production'
  }
}

const {
  MONGO_HOST,
  MONGO_DB,
  MONGO_GTFS_DB,
} = process.env;

import http from "http"
import https from "https"
import express from "express"
import {
  graphqlHTTP
} from "express-graphql"
import fs from "fs"
import { MongoClient } from "mongodb";
import { tranzResolvers, gtfsResolvers, getBusData } from './resolvers'
import {  makeExecutableSchema } from "graphql-tools";
import merge from "lodash.merge"
import { checkVersions } from "./watch";
import { IResolvers } from "@graphql-tools/utils";

const app = express();
const uri = `mongodb://${MONGO_HOST}:27017`;
const hour = 1000 * 60 * 60; // 1 hour

const client = new MongoClient(uri);

const main = async () => {
  await client.connect();
  const tranzDb = client.db(MONGO_DB);
  const gtfsDb = client.db(MONGO_GTFS_DB);

  checkVersions(gtfsDb);
  setInterval(() => checkVersions(gtfsDb), 1 * hour);

  const typeDefs: string = (() => {
    const files = fs.readdirSync('./schema')
    let content = '';

    for (const file of files) {
      content += fs.readFileSync('./schema/'+file).toString()
    }

    return content;
  })();

  const resolvers: IResolvers = merge(tranzResolvers(tranzDb, gtfsDb), gtfsResolvers(tranzDb, gtfsDb));

  app.use('/graphql', graphqlHTTP({
    graphiql: process.env.NODE_ENV === 'development',
    schema: makeExecutableSchema({
      typeDefs,
      resolvers
    })
  }))

  app.get('/vehicles', (req, res) => {
    getBusData().then(data => {
      res.send(data);
    }).catch((e: Error) => {
      res.status(500).send({
        error: e.message
      });
    });
  });

  const httpServer = http.createServer(app);
  httpServer.listen(8080, () => console.log(`Listening on port 8080`));
}

try {
  main()
} catch (e) {
  console.dir(e)
} finally {
  client.close()
}