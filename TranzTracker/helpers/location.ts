import * as ExpoLocation from 'expo-location'
import { LocationObject } from 'expo-location';
import { Region } from 'react-native-maps'
import { Position } from '../interfaces';

export function gtfsPositionToRegion(pos: Position): Region {
  return {
    latitude: pos.latitude,
    longitude: pos.longitude,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0121
  }
}

export async function getRegionLocation(): Promise<Region> {
  const location = await getLocation();
  
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  }
}

/**
 * Gets the devices current location. If permission is denied,
 * throw an error.
 */
export async function getLocation(): Promise<LocationObject> {
  const { status } = await ExpoLocation.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Did not get permission to get location.')
  }

  const location = await ExpoLocation.getCurrentPositionAsync({});
  return location
}
