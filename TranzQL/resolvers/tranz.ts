import { IResolvers } from "@graphql-tools/utils";
import { Db } from "mongodb";

export const tranzResolvers = (db: Db, gtfsDb: Db): IResolvers => ({
  Query: {
    shifts: () => {
      return db.collection('shifts').find({}).toArray()
    },

    shift: (_, args) => {
      return db.collection('shifts').findOne({
        _id: args.id
      })
    } 
  },

  Shift: {
    splits: (shift) => {
      return db.collection('splits').find({
        shift_id: shift._id
      }).toArray()
    }
  },

  Split: {
    shift: (split) => {
      return db.collection('shifts').find({
        _id: split.shift_id
      }).toArray()
    },

    trips: (split) => {
      return db.collection('trips').find({
        split_id: split._id
      }).sort({ time: 1 }).toArray()
    },

    breaks: (split) => {
      return db.collection('breaks').find({
        split_id: split._id
      }).toArray()
    }
  },

  Trip: {
    split: (trip) => {
      return db.collection('splits').findOne({
        _id: trip.split_id
      })
    }
  },

  Break: {
    split: (_break) => {
      return db.collection('splits').findOne({
        _id: _break.split_id
      })
    }
  }
})
