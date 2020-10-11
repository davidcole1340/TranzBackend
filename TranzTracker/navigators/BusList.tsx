import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { BaseTabParamList } from '.';
import { List } from '../screens/BusList';

export type BusListParamList = {
  'Bus List': {
    updateVehicleLocations: () => void
  }
}

export type BusListNav = BottomTabNavigationProp<BaseTabParamList, 'Bus List'>
type BusListRoute = RouteProp<BaseTabParamList, 'Bus List'>

type MapProps = {
  navigation: BusListNav,
  route: BusListRoute,
  updateVehicleLocations: () => void
}

const Stack = createStackNavigator()

export class BusList extends React.Component<MapProps> {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Bus List" component={List} />
      </Stack.Navigator>
    )
  }
}