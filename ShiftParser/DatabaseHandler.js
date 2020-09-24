module.exports = {
  insertShifts: async (shifts, db) => {
    const c = db.collection('shifts');
    c.createIndex('shift_id');
    await c.insertMany(shifts);    
  },
  insertSplits: async (splits, db) => {
    const c = db.collection('splits');
    c.createIndex('split_id');
    await c.insertMany(splits);   
  },
  insertTrips: async (trips, db) => {
    const c = db.collection('trips');
    await c.insertMany(trips);   
  },
  insertBreaks: async (breaks, db) => {
    const c = db.collection('breaks');
    await c.insertMany(breaks);   
  }
};