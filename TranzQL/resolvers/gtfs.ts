import { IResolvers } from "graphql-tools";
import { Db } from "mongodb";

export default (db: Db): IResolvers => ({
  Query: {
    routes: () => {
      return db.collection('routes').find({}).toArray()
    },

    trip: (_, args) => {
      return db.collection('trips').find({
        _id: args.id
      }).toArray().then(trips => trips[0])
    }
  },

  Route: {
    trips: (parent) => {
      return db.collection('trips').find({
        route_id: parent._id
      }).toArray()
    }
  },

  GTFSTrip: {
    route: (parent) => {
      return db.collection('routes').find({
        _id: parent.route_id
      }).toArray().then(routes => routes[0])
    },

    stop_times: (parent) => {
      return db.collection('stop_times').find({
        trip_id: parent._id
      }).toArray()
    }
  },

  StopTime: {
    trip: (parent) => {
      return db.collection('trips').find({
        _id: parent.trip_id
      }).toArray().then(trips => trips[0])
    },

    stop: (parent) => {
      return db.collection('stops').find({
        _id: parent.stop_id
      }).toArray().then(stops => stops[0])
    }
  }
})
