const BASE_API = 'http://192.168.86.163:8080'

interface TripUpdate_Update {
  trip: Trip,
  stop_time_update: StopTimeUpdate,
  vehicle: Vehicle,
  timestamp: number,
  delay: number
}

interface VehiclePosition_Vehicle {
  trip: Trip,
  position: Position,
  timestamp: number,
  vehicle: Vehicle,
  occupancy_status: number
}

interface Trip {
  trip_id: string,
  start_time: string,
  start_date: string,
  schedule_relationship: number,
  route_id: string,
  direction_id: number
}

interface StopTimeUpdate {
  stop_sequence: number,
  arrival: {
    delay: number,
    time: number,
    uncertainty: number
  },
  stop_id: string,
  schedule_relationship: number
}

interface Vehicle {
  id: string,
  label: string,
  license_plate: string
}

interface Position {
  latitude: number,
  longitude: number,
  bearing: number,
  odometer: number,
  speed: number
}

export interface BusData extends TripUpdate_Update, VehiclePosition_Vehicle {}

export async function getVehicleLocations(): Promise<BusData[]> {
  const resp = await fetch(`${BASE_API}/vehicles`)
  return resp.json()
}