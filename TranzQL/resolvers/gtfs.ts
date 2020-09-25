import { IResolvers } from "graphql-tools";
import { Db } from "mongodb";

const { HOLIDAY_TIMETABLE } = process.env

interface Calendar {
  _id: string,
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

export default (tranzDb: Db, db: Db): IResolvers => ({
  Query: {
    routes: () => {
      return db.collection('routes').find({}).toArray()
    },

    trip: (_, args) => {
      return db.collection('trips').findOne({
        _id: args.id
      })
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
      const calendar: Calendar = await db.collection('calendar').findOne({
        _id: trip.service_id
      }) as Calendar

      const route_id: string = trip.route_id.split('-')[0]
      const firstStop = await db.collection('stop_times').findOne({
        trip_id: trip._id,
        stop_sequence: 1
      })
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
