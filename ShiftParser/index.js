const { PdfReader, Rule } = require('pdfreader');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const dbh = require('./DatabaseHandler');

const {
  MONGO_HOST,
  MONGO_DB
} = process.env;

if (! MONGO_HOST || ! MONGO_DB) {
  console.error(`env variables are not set: MONGO_HOST=${MONGO_HOST}, MONGO_DB=${MONGO_DB}`);
  return process.exit(1);
}

let shifts = [], splits = [], trips = [], breaks = [];

let shift;
let split;
let nextCallback;
let nextCount;

const files = [
  {
    fileName: 'weekday.pdf',
    shiftType: 0
  },
  {
    fileName: 'weekend.pdf',
    shiftType: 1
  },
  {
    fileName: 'schoolhol.pdf',
    shiftType: 2
  }
];

let splitids = {};
let tripids = {};
let breakids = {};

const getSplitId = (route_id) => {
  if (! splitids.hasOwnProperty(route_id)) {
    splitids[route_id] = 0;
  }
  
  const id = splitids[route_id]++;

  return `${route_id}_${id}`;
};

const getTripId = (split_id) => {
  if (! tripids.hasOwnProperty(split_id)) {
    tripids[split_id] = 0;
  }
  
  const id = tripids[split_id]++;

  return `${split_id}_${id}`;
};

const getBreakId = (break_id) => {
  if (! breakids.hasOwnProperty(break_id)) {
    breakids[break_id] = 0;
  }
  
  const id = breakids[break_id]++;

  return `${break_id}_${id}`;
};

const getNextValue = (callback, n) => {
  nextCount = n ? n : 1;
  nextCallback = callback;
};

const cases = [
  {
    regex: /SHIFT (.*)/,
    callback: result => {
      shift._id = result[1];
    }
  },
  {
    regex: /HOURS\s*WORKED\s*:\s*([^\s]*)/,
    callback: result => {
      shift.hours_worked = result[1];
    }
  },
  {
    regex: /Sign On/,
    callback: () => {
      split = {
        sign_on: null,
        sign_off: null,
        shift_id: shift._id,
        _id: getSplitId(shift._id)
      };

      getNextValue(result => {
        split.sign_on = result;
      })
    }
  },
  {
    regex: /Depot Finish/,
    callback: () => {
      getNextValue(result => {
        split.sign_off = result;
        splits.push(split);
        split = null;
      })
    }
  },
  {
    regex: /([0-9]{4}) Special To (.*)/,
    callback: result => {
      trips.push({
        _id: getTripId(split._id),
        split_id: split._id,
        destination: result[2],
        time: result[1]
      })
    }
  },
  {
    regex: /Route: (.*) - V:([0-9 ]*) - D:.*- Trip:([0-9]{4}) - D:([0-9]{4})/,
    callback: result => {
      getNextValue(next => {
        if (next != result[3]) return;

        trips.push({
          _id: getTripId(split._id),
          split_id: split._id,
          route: result[1],
          route_id: result[2],
          time: result[3]
        })
      }, 2);
    }
  },
  {
    regex: /PAID REST BREAK from ([0-9]*) to ([0-9]*)/,
    callback: result => {
      breaks.push({
        _id: getBreakId(split._id),
        split_id: split._id,
        start: result[1],
        finish: result[2],
        paid: true
      })
    }
  },
  {
    regex: /MEAL from ([0-9]*) to ([0-9]*)/,
    callback: result => {
      breaks.push({
        _id: getBreakId(split._id),
        split_id: split._id,
        start: result[1],
        finish: result[2],
        paid: false
      })
    }
  }
];

function parseFile(file) {
  return new Promise((resolve, reject) => {
    new PdfReader().parseFileItems(file.fileName, (err, item) => {
      if (err) reject(err);
      if (! item) {
        resolve();
        return;
      }
    
      if (item.page) {
        if (shift) {
          shifts.push(shift);
        }
        
        console.log(`Page: ${item.page}`);

        shift = {
          _id: 0,
          hours_worked: 0,
          type: file.shiftType
        }
      }
    
      if (item.text) {
        if (nextCallback) {
          if (--nextCount == 0) {
            nextCallback(item.text);
            nextCallback = null;
          }
        }
    
        cases.forEach(matcher => {
          let result = matcher.regex.exec(item.text);
    
          if (result) {
            matcher.callback(result);
          }
        });
      }
    });
  });
}

async function parseAllFiles() {
  for (let file of files) {
    await parseFile(file);
  }
}

async function insertAll(db) {
  await dbh.insertShifts(shifts, db);
  await dbh.insertSplits(splits, db);
  await dbh.insertTrips(trips, db);
  await dbh.insertBreaks(breaks, db);
}

parseAllFiles().then(() => {
  console.log('Finished collecting shifts.');
  const url = `mongodb://${MONGO_HOST}:27017`;

  MongoClient.connect(`mongodb://${MONGO_HOST}:27017`).then(client => {
    const db = client.db(MONGO_DB);
    console.log(`Connected to mongodb: ${url}, db: ${MONGO_DB}`);

    insertAll(db).then(() => {
      console.log('Finished inserting');
      client.close();
    }).catch(console.error);
  }).catch(console.error);
}).catch(console.error);
