declare var process: {
  env: {
    MONGO_HOST: string,
    MONGO_DB: string,
    MONGO_GTFS_DB: string,
    TRANZQL_PORT: number,
    HOLIDAY_TIMETABLE: string,
    AT_API_KEY: string,
    NODE_ENV: 'development' | 'production'
  }
}

const {
  MONGO_HOST,
  MONGO_DB,
  MONGO_GTFS_DB,
  TRANZQL_PORT
} = process.env;

import express from "express"
import {
  graphqlHTTP
} from "express-graphql"
import fs from "fs"
import { MongoClient } from "mongodb";
import { tranzResolvers, gtfsResolvers, getBusData } from './resolvers'
import { IResolvers, makeExecutableSchema } from "graphql-tools";
import merge from "lodash.merge"

const app = express();
const uri = `mongodb://${MONGO_HOST}:27017`;

MongoClient.connect(uri, { useUnifiedTopology: true }).then((client) => {
  const tranzDb = client.db(MONGO_DB);
  const gtfsDb = client.db(MONGO_GTFS_DB);

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
    }).catch(e => {
      res.status(500).send({
        error: e
      });
    });
  });

  app.listen(TRANZQL_PORT, () => console.log(`Listening on port ${TRANZQL_PORT}`))
}).catch(console.error)