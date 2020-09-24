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
import Schema from "./schema"

const app = express();

Schema(MONGO_HOST, MONGO_DB).then((sch) => {
  app.use('/graphql', graphqlHTTP({
    graphiql: process.env.NODE_ENV === 'development',
    schema: sch
  }))

  app.listen(TRANZQL_PORT, () => console.log(`Listening on port ${TRANZQL_PORT}`))
}).catch(console.error)

