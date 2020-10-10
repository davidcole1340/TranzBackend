import React from "react";
import { BusData } from "../interfaces";

type BusContextType = {
  loading: boolean,
  buses: BusData[]
}

export const BusListContext = React.createContext<BusContextType>({
  loading: true,
  buses: []
})