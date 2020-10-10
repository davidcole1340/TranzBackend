import moment from "moment";
import { BusData } from "../interfaces";
import { Break, Trip } from "../interfaces/tranzit";

enum BusDirection {
  City = 0,
  Albany
}

export function getBusDelay(bus: BusData): string {
  if (! bus.stop_time_update) {
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
    output += 'Ahead of schedule by ';
    delay = -delay;
  } else {
    output += 'Behind schedule by ';
  }

  const minutes = Math.floor(delay / 60);
  const seconds = delay - minutes * 60;

  output += `${minutes} min ${seconds} sec`

  return output
}

export function getBusDirection(bus: BusData): string {
  if (! bus.trip) {
    return 'Not in service'
  }

  switch (bus.trip.direction_id) {
    case BusDirection.City:
      return 'City-bound'
    case BusDirection.Albany:
      return 'Albany-bound'
  }

  return '';
}

export function getTime(a: Trip|Break, start: boolean = true): moment.Moment {
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