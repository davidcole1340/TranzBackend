import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { BusData } from "../interfaces";
import { Break, Trip } from "../interfaces/tranzit";
import { grey, isDark } from '../styles';
import { AlbanyBound } from '../screens/BusList/AlbanyBound';

export enum BusDirection {
  City = 0,
  Albany
}

const AlbanyBoundStopOrder = [
  7089, // Wellesley near AUT
  1364, // Mayoral Dr
  1090, // Wellesley St
  1334, // Halsey St
  7036, // Vic Park
  4063, // Akoranga
  3355, // Smales Farm
  3221, // Sunnynook
  4223, // Constellation
  4225, // Constellation Stop C
  4227, // Albany
  4981 // HBC
]

const CityBoundStopOrder = [
  4981, // HBC
  4228, // Albany
  4222, // Constellation
  3219, // Sunnynook
  3360, // Smales Farm
  4065, // Akoranga
  7037, // Fanshawe
  1319, // Halsey St
  1079, // Wellesley St
  7082, // Hobson St
  1318, // Mayoral Dr
  7128, // Wakefield St
  7147, // Symonds St
]

export function getStopId(stop: string): number {
  return Number(
    stop.split('-')[0]
  )
}

export function getStopOrder(stop: string, direction: BusDirection): number {
  let _index: number = 0
  const bus_stop_id = getStopId(stop)

  // City-Bound
  if (direction == BusDirection.City) {
    CityBoundStopOrder.find((stop_id, index) => {
      if (stop_id == bus_stop_id) {
        _index = index
        return true
      }
    })
  }
  // Albany-Bound
  else {
    AlbanyBoundStopOrder.find((stop_id, index) => {
      if (stop_id == bus_stop_id) {
        _index = index
        return true
      }
    })
  }

  return _index
}

export function getBusDelay(bus: BusData): string {
  if (!bus.stop_time_update) {
    return 'No delay information available'
  }

  var delay: number;

  if (bus.stop_time_update.arrival) {
    delay = bus.stop_time_update.arrival.delay
  } else if (bus.stop_time_update.departure) {
    delay = bus.stop_time_update.departure.delay
  } else {
    return 'No delay information available';
  }

  var output: string = '';

  if (delay < 0) {
    output += 'Ahead ';
    delay = -delay;
  } else {
    output += 'Behind ';
  }

  const minutes = Math.floor(delay / 60);
  const seconds = delay - minutes * 60;

  output += `${minutes} min ${seconds} sec`

  return output
}

export function getBusDirection(bus: BusData): string {
  if (!bus.trip) {
    return 'Not in service'
  }

  switch (bus.trip.direction_id) {
    case BusDirection.City:
      return 'City-bound'
    case BusDirection.Albany:
      return 'Albany-bound'
  }

  return 'Direction unknown';
}

export function getTime(a: Trip | Break, start: boolean = true): moment.Moment {
  const time = (() => {
    if ((a as Trip).time) {
      return (a as Trip).time
    } else {
      if (start) {
        return (a as Break).start
      } else {
        return (a as Break).finish
      }
    }
  })()

  return moment(time, 'hhmm')
}

export const getIcon = (icon: string) => {
  return (props: { focused: boolean, color: string, size: number }): React.ReactNode => {
    return (
      <Ionicons name={icon} color={props.color} size={props.size} />
    )
  }
}

export async function asyncDelay(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export function getBusColor(bus: BusData): string {
  if (bus.occupancy_status < 1) return 'aqua';
  else if (bus.occupancy_status < 2) return 'green'
  else if (bus.occupancy_status < 3) return 'orange';

  return 'red';
}