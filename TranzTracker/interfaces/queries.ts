import { GTFSTrip } from "./gtfs";
import { Shift } from "./tranzit";

export type TripQuery = {
  trip?: GTFSTrip
}

export type ShiftQuery = {
  trip?: {
    shift: Shift
  }
}