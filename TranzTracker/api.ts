import { BusData } from './interfaces'
import { TripQuery } from './interfaces/queries'

const BASE_API = 'http://172.23.138.210:8080'

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
  return callGraphql<TripQuery>(`{
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
  }`);
}