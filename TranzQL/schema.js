const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'message',
    fields: () => ({
      message: { type: GraphQLString, resolve: () => 'testing nodemon!' }
    })
  })
})