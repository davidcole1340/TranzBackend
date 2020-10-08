import * as ExpoLocation from 'expo-location'
import { Region } from 'react-native-maps'

/**
 * Gets the devices current location. If permission is denied,
 * throw an error.
 */
export async function getLocation(): Promise<Region> {
  const { status } = await ExpoLocation.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Did not get permission to get location.')
  }

  const location = await ExpoLocation.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  }
}