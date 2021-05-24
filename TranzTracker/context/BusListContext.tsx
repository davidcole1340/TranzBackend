import React from "react";
import { BusData } from "../interfaces";
import { Route, Stop } from "../interfaces/gtfs";

export type BusListContextType = {
  loading: boolean,
  buses: BusData[],
  stops: Stop[],
  routes: Route[],
  updateVehicleLocations: () => void
}

export const BusListContext = React.createContext<BusListContextType>({
  loading: true,
  buses: [],
  stops: [],
  routes: [],
  updateVehicleLocations: () => { }
})