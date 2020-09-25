declare var process: {
  env: {
    MONGO_HOST: string,
    MONGO_DB: string,
    MONGO_GTFS_DB: string,
    TRANZQL_PORT: number,
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
import tranzResolvers from "./resolvers/tranz"
import gtfsResolvers from "./resolvers/gtfs"
import { IResolvers, makeExecutableSchema } from "graphql-tools";

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

  const resolvers: IResolvers = {
    ...tranzResolvers(tranzDb),
    ...gtfsResolvers(gtfsDb)
  };

  app.use('/graphql', graphqlHTTP({
    graphiql: process.env.NODE_ENV === 'development',
    schema: makeExecutableSchema({
      typeDefs,
      resolvers
    })
  }))

  app.listen(TRANZQL_PORT, () => console.log(`Listening on port ${TRANZQL_PORT}`))
}).catch(console.error)