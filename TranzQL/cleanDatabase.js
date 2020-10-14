const { MongoClient } = require('mongodb')

if (process.argv.length < 4) {
  console.error(`usage: ${process.argv[0]} ${process.argv[1]} <mongo_host> <mongo_db>`);
  process.exit(1);
}

const MONGO_HOST = process.argv[2];
const MONGO_DB = process.argv[3];

async function clean() {
  const url = `mongodb://${MONGO_HOST}:27017`;
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db(MONGO_DB);
  console.log(`Connected to ${url}/${MONGO_DB}`);

  const routes = (await db.collection('routes').find({
    agency_id: {'$ne': 'TZG'}
  }).toArray()).map(route => route._id);

  const trips = (await db.collection('trips').find({
    route_id: {'$in': routes}
  }).toArray()).map(trip => trip._id);

  // Delete stop times
  const stopTimesCount = await db.collection('stop_times').deleteMany({
    trip_id: {'$in': trips}
  });

  // Delete trips
  const tripsCount = await db.collection('trips').deleteMany({
    _id: {'$in': trips}
  });

  // Delete routes
  const routesCount = await db.collection('routes').deleteMany({
    _id: {'$in': routes}
  });

  console.log(`removed the following: stop_times: ${stopTimesCount.deletedCount}, trips: ${tripsCount.deletedCount}, routes: ${routesCount.deletedCount}`);
  client.close();
}

clean().catch(console.error);