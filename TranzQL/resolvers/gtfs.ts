import { IResolvers } from "@graphql-tools/utils";
import { Db } from "mongodb";

const { HOLIDAY_TIMETABLE } = process.env

interface Calendar {
  start_date: string,
  end_date: string,
  monday: boolean,
  tuesday: boolean,
  wednesday: boolean,
  thursday: boolean,
  friday: boolean,
  saturday: boolean,
  sunday: boolean
}

export const gtfsResolvers = (tranzDb: Db, db: Db): IResolvers => ({
  Query: {
    routes: () => {
      return db.collection('routes').find({}).toArray()
    },

    trip: (_, args) => {
      return db.collection('trips').findOne({
        _id: args.id
      })
    },

    stops: async () => {
      const routes = await db.collection('routes').find({}).toArray()
      const trips = await db.collection('trips').find({ route_id: {'$in': routes.map(route => route._id)} }).toArray()
      const stop_times = await db.collection('stop_times').find({ trip_id: {'$in': trips.map(trip => trip._id)} }).toArray()

      return db.collection('stops').find({ _id: {'$in': stop_times.map(st => st.stop_id)} }).toArray()
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
      return db.collection('routes').findOne({
        _id: parent.route_id
      })
    },

    stop_times: (parent) => {
      return db.collection('stop_times').find({
        trip_id: parent._id
      }).toArray()
    },

    shift: async (trip) => {
      const raise = (msg: string) => {
        throw new Error(msg)
      }

      const calendar = await db.collection<Calendar>('calendar').findOne({_id: trip.service_id}) ?? raise('Could not find calendar entry');
      const route_id: string = trip.route_id.split('-')[0]
      const firstStop = await db.collection('stop_times').findOne({
        trip_id: trip._id,
        stop_sequence: 1
      }) ?? raise('Could not find stop time entry')

      const shiftType: 0|1|2 = (() => {
        if (calendar.monday && calendar.tuesday && calendar.wednesday && calendar.thursday && calendar.thursday) {
          if (calendar.saturday && calendar.sunday) {
            const day = new Date().getDay()
            if (day > 0 && day < 6) return HOLIDAY_TIMETABLE ? 2 : 0
          } else {
            return HOLIDAY_TIMETABLE ? 2 : 0 
          }
        }

        return 1
      })()

      const trips = await tranzDb.collection('trips').find({
        route_id: route_id,
        time: firstStop.arrival_time.replace(':', '').substr(0, 4)
      }).toArray()
      
      return await (async () => {
        for (const trip of trips) {
          const shift = await tranzDb.collection('shifts').findOne({
            _id: trip.split_id.substr(0, trip.split_id.indexOf('_')),
            type: shiftType
          })

          if (shift) {
            return shift
          }
        }
      })()
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
