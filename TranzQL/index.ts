declare var process: {
  env: {
    MONGO_HOST: string,
    MONGO_DB: string,
    MONGO_GTFS_DB: string,
    TRANZQL_PORT: number,
    SSL_KEY_PATH: string|undefined,
    NODE_ENV: 'development' | 'production'
  }
}

const {
  MONGO_HOST,
  MONGO_DB,
  MONGO_GTFS_DB,
  TRANZQL_PORT,
  SSL_KEY_PATH
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
  httpServer.listen(TRANZQL_PORT, () => console.log(`Listening on port ${TRANZQL_PORT}`));

  if (SSL_KEY_PATH && SSL_KEY_PATH !== '') {
    const creds: https.ServerOptions = {
      key: fs.readFileSync(`${SSL_KEY_PATH}/privkey.pem`, 'utf8'),
      cert: fs.readFileSync(`${SSL_KEY_PATH}/cert.pem`, 'utf8'),
      ca: fs.readFileSync(`${SSL_KEY_PATH}/fullchain.pem`, 'utf8')
    }

    const httpsServer = https.createServer(creds, app);
    httpsServer.listen(443, () => console.log('https server listening on 443'));
  }
}

try {
  main()
} catch (e) {
  console.dir(e)
} finally {
  client.close()
}