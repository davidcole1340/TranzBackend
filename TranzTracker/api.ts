import { BusData } from './interfaces'
import { ShiftQuery, TripQuery } from './interfaces/queries'
import { Shift } from './interfaces/tranzit'

const BASE_API = 'http://127.0.0.1:8080'

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
          sign_on
          sign_off
          trips {
            destination
            route
            route_id
            time
          }
          breaks {
            start
            finish
            paid
          }
        }
      }
    }
  }
  `)
  
  if (! result.trip) {
    throw new Error('Could not find shift via trip id.')
  }

  return result.trip.shift
}