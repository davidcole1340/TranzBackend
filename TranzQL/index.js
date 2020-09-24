const {
  TRANZQL_PORT
} = process.env;

const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const app = express();

app.use('/graphql', graphqlHTTP({
  graphiql: process.env.NODE_ENV === 'development',
  schema: require('./schema')
}))
app.listen(TRANZQL_PORT, () => console.log(`Listening on port ${TRANZQL_PORT}`))