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

interface StopTimeUpdateTime {
  delay: number,
  time: number,
  uncertainty: number
}

interface StopTimeUpdate {
  stop_sequence: number,
  arrival?: StopTimeUpdateTime,
  departure?: StopTimeUpdateTime,
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