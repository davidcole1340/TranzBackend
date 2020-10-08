import { Shift } from "./tranzit"

export type Calendar = {
  _id: string
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

export type Route = {
  _id: string
  agency_id: string
  route_color: string
  route_long_name: string
  route_short_name: string
  route_text_color: string
  route_type: number

  trips: GTFSTrip[]
}

export type GTFSTrip = {
  _id: string
  block_id: string
  direction_id: number
  route_id: string
  service_id: string
  shape_id: string
  trip_headsign: string

  route: Route
  stop_times: StopTime[]
  shift: Shift
}

export type StopTime = {
  _id: string
  arrival_time: string
  departure_time: string
  drop_off_type: string
  pickup_type: string
  shape_dist_traveled: string
  stop_headsign: string
  stop_id: string
  stop_sequence: number
  trip_id: string

  trip: GTFSTrip
  stop: Stop
}

export type Stop = {
  _id: string
  location_type: number
  parent_station: string
  stop_code: number
  stop_desc: string
  stop_lat: number
  stop_lon: number
  stop_name: string
  zone_id: string
}