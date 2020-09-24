import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString, GraphQLList, GraphQLNonNull, GraphQLFloat, GraphQLInt, GraphQLBoolean
} from "graphql"

import { MongoClient } from "mongodb"

export default async function(mongoHost: string, mongoDb: string) {
  const client = await MongoClient.connect(`mongodb://${mongoHost}:27017`, { useUnifiedTopology: true })
  const db = client.db(mongoDb);

  const ShiftType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Shift',
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      hours_worked: { type: GraphQLNonNull(GraphQLFloat) },
      type: { type: GraphQLNonNull(GraphQLInt) },
      splits: {
        type: new GraphQLList(SplitType),
        resolve: (shift) => {
          return db.collection('splits').find({
            shift_id: shift._id
          }).toArray()
        }
      }
    })
  })

  const SplitType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Split',
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      sign_on: { type: GraphQLNonNull(GraphQLString) },
      sign_off: { type: GraphQLNonNull(GraphQLString) },
      shift_id: { type: GraphQLNonNull(GraphQLString) },
      shift: {
        type: GraphQLNonNull(ShiftType),
        resolve: async (split) => {
          const data = await db.collection('shifts').find({
            _id: split.shift_id
          }).toArray()

          return data[0]
        }
      },
      trips: {
        type: new GraphQLList(TripType),
        resolve: (split) => {
          return db.collection('trips').find({
            split_id: split._id
          }).toArray()
        } 
      }
    })
  })

  const TripType = new GraphQLObjectType({
    name: 'Trip',
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      split_id: { type: GraphQLNonNull(GraphQLString) },
      destination: { type: GraphQLString },
      time: { type: GraphQLNonNull(GraphQLString) },
      route: { type: GraphQLString },
      route_id: { type: GraphQLNonNull(GraphQLString) },
      split: {
        type: GraphQLNonNull(SplitType),
        resolve: (trip) => {
          return db.collection('splits').find({
            _id: trip.split_id
          }).toArray()
        }
      }
    })
  });

  const BreakType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Break',
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      split_id: { type: GraphQLNonNull(GraphQLString) },
      start: { type: GraphQLNonNull(GraphQLString) },
      finish: { type: GraphQLNonNull(GraphQLString) },
      paid: { type: GraphQLNonNull(GraphQLBoolean) },
      split: {
        type: GraphQLNonNull(SplitType),
        resolve: (_break) => {
          return db.collection('splits').find({
            _id: _break.split_id
          }).toArray()
        }
      }
    })
  })

  const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      shifts: {
        type: new GraphQLList(ShiftType),
        resolve: () => {
          return db.collection('shifts').find({}).toArray()
        }
      },
      shift: {
        type: ShiftType,
        args: { id: { type: GraphQLString } },
        resolve: async (parent, args) => {
          const data = await db.collection('shifts').find({
            _id: args.id
          }).toArray()

          return data[0]
        }
      }
    })
  })

  return new GraphQLSchema({
    query: RootQueryType
  })
}