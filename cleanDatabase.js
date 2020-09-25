const routes = db.getCollection('routes').find({
  agency_id: {'$ne': 'TZG'}
}).toArray().map(route => route._id)

const trips = db.getCollection('trips').find({
  route_id: {'$in': routes}
}).toArray().map(trip => trip._id)

// Delete stop times
const stopTimesCount = db.getCollection('stop_times').deleteMany({
  trip_id: {'$in': trips}
})

// Delete trips
const tripsCount = db.getCollection('trips').deleteMany({
  _id: {'$in': trips}
})

// Delete routes
const routesCount = db.getCollection('routes').deleteMany({
  _id: {'$in': routes}
})

print(`stop times: ${stopTimesCount.deletedCount}, trips: ${tripsCount.deletedCount}, routes: ${routesCount.deletedCount}`)