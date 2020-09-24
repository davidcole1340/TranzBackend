declare var process: {
  env: {
    MONGO_HOST: string,
    MONGO_DB: string,
    TRANZQL_PORT: number,
    NODE_ENV: 'development' | 'production'
  }
}

const {
  MONGO_HOST,
  MONGO_DB,
  TRANZQL_PORT
} = process.env;

import express from "express"
import {
  graphqlHTTP
} from "express-graphql"
import { buildSchema } from "graphql"
import fs from "fs"
import { MongoClient } from "mongodb";
import getResolvers from "./resolvers"
import { makeExecutableSchema } from "graphql-tools";

const app = express();
const uri = `mongodb://${MONGO_HOST}:27017`;

MongoClient.connect(uri, { useUnifiedTopology: true }).then((client) => {
  const db = client.db(MONGO_DB);
  const typeDefs = fs.readFileSync('./schema.graphql').toString()
  const resolvers = getResolvers(db)

  app.use('/graphql', graphqlHTTP({
    graphiql: process.env.NODE_ENV === 'development',
    schema: makeExecutableSchema({
      typeDefs,
      resolvers
    })
  }))

  app.listen(TRANZQL_PORT, () => console.log(`Listening on port ${TRANZQL_PORT}`))
})