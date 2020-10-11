import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { BaseTabParamList } from '.';
import { List } from '../screens/BusList';

export type BusListParamList = {
  List: {}
}

export type BusListNav = BottomTabNavigationProp<BaseTabParamList, 'Bus List'>
type BusListRoute = RouteProp<BaseTabParamList, 'Bus List'>

type MapProps = {
  navigation: BusListNav,
  route: BusListRoute
}

export function BusList(props: MapProps) {
  const Stack = createStackNavigator()

  return (
    <Stack.Navigator>
      <Stack.Screen name="List" component={List} />
    </Stack.Navigator>
  )
}