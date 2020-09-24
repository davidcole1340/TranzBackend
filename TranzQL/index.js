const {
  TRANZQL_PORT
} = process.env;

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')

const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const app = express();

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'message',
    fields: () => ({
      message: { type: GraphQLString, resolve: () => 'testing nodemon!' }
    })
  })
})

app.use('/graphql', graphqlHTTP({
  graphiql: process.env.NODE_ENV === 'development',
  schema: schema
}))
app.listen(TRANZQL_PORT, () => console.log(`Listening on port ${TRANZQL_PORT}`))