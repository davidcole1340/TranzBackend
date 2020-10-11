import React from "react";
import { BusData } from "../interfaces";

export type BusListContextType = {
  loading: boolean,
  buses: BusData[],
  updateVehicleLocations: () => void
}

export const BusListContext = React.createContext<BusListContextType>({
  loading: true,
  buses: [],
  updateVehicleLocations: () => {}
})