import React from "react";
import { BusData } from "../interfaces";
import { Stop } from "../interfaces/gtfs";

export type BusListContextType = {
  loading: boolean,
  buses: BusData[],
  stops: Stop[],
  updateVehicleLocations: () => void
}

export const BusListContext = React.createContext<BusListContextType>({
  loading: true,
  buses: [],
  stops: [],
  updateVehicleLocations: () => {}
})