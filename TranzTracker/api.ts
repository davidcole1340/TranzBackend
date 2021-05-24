import { BusData } from './interfaces'
import { Route, Stop } from './interfaces/gtfs'
import { RouteQuery, ShiftQuery, StopQuery, TripQuery } from './interfaces/queries'
import { Shift } from './interfaces/tranzit'

const BASE_API = 'https://dcol542.co/tranzit'

async function callGraphql<T>(query: string): Promise<T> {
  const resp = await fetch(`${BASE_API}/graphql?query=${query}`)
  const json = await resp.json()
  return json.data
}

export async function getVehicleLocations(): Promise<BusData[]> {
  const resp = await fetch(`${BASE_API}/vehicles`)
  return resp.json()
}

export async function getBusStops(bus: BusData): Promise<TripQuery> {
  return callGraphql<TripQuery>(`
  {
    trip(id: "${bus.trip.trip_id}") {
      shift {
        _id
      }
      stop_times {
        arrival_time
        stop {
          stop_name
          stop_lat
          stop_lon
        }
        stop_sequence
      }
    }
  }
  `);
}

export async function getShift(bus: BusData): Promise<Shift> {
  const result = await callGraphql<ShiftQuery>(`
  {
    trip(id: "${bus.trip.trip_id}") {
      shift {
        _id
        hours_worked
        splits {
          _id
          sign_on
          sign_off
          trips {
            _id
            destination
            route
            route_id
            time
          }
          breaks {
            _id
            start
            finish
            paid
          }
        }
      }
    }
  }
  `)

  if (!result.trip) {
    throw new Error('Could not find shift via trip id.')
  }

  return result.trip.shift
}

export async function getStops(): Promise<Stop[]> {
  const result = await callGraphql<StopQuery>(`
  {
    stops {
      _id
      stop_name
      stop_lon
      stop_lat
    }
  }
  `)

  return result.stops
}

export async function getRoutes(): Promise<Route[]> {
  const result = await callGraphql<RouteQuery>(`
  {
    routes {
      _id
      route_long_name
      route_short_name
    }
  }
  `);

  return result.routes;
}