import AsyncStorage from '@react-native-community/async-storage'
import moment from 'moment'
import { BusData } from '../interfaces'

const storageKey = 'TranzTrackerCheckInStorage';

export type CheckIn = {
  bus: BusData
  time: moment.Moment
}

export async function getCheckIns(): Promise<CheckIn[]> {
  try {
    const jsonVal = await AsyncStorage.getItem(storageKey);
    if (! jsonVal) return [];
    const parsed: CheckIn[] = JSON.parse(jsonVal);
    const out: CheckIn[] = [];

    parsed.forEach(obj => {
      out.push({
        bus: obj.bus,
        time: moment(obj.time)
      })
    });

    return out
  } catch (e) {
    alert(`Error retrieving check ins: ${e.message}`);
    return [];
  }
}

export async function addCheckIn(bus: BusData): Promise<CheckIn[]> {
  const state: CheckIn = {
    bus: bus,
    time: moment()
  }

  const checkIns = await getCheckIns();
  checkIns.push(state);
  
  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(checkIns));
  } catch (e) {
    alert(`Error storing check in: ${e.message}`);
  }

  return checkIns;
}

export async function clearCheckIns(): Promise<void> {
  try {
    await AsyncStorage.removeItem(storageKey);
  } catch (e) {
    alert('Error clearing check ins');
  }
}