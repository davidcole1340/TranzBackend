const config = require('./config.json')

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
      message: { type: GraphQLString, resolve: () => 'hello, world!' }
    })
  })
})

app.use('/graphql', graphqlHTTP({
  graphiql: true,
  schema: schema
}))
app.listen(config.server.port, () => console.log(`Listening on port ${config.server.port}`))