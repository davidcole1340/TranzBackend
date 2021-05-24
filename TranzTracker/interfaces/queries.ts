import { GTFSTrip, Route, Stop } from "./gtfs";
import { Shift } from "./tranzit";

export type TripQuery = {
  trip?: GTFSTrip
}

export type ShiftQuery = {
  trip?: {
    shift: Shift
  }
}

export type StopQuery = {
  stops: Stop[]
}

export type RouteQuery = {
  routes: Route[]
}