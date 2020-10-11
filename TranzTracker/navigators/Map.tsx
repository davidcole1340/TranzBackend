import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { TitleButtons } from '../components';
import { BusData } from '../interfaces';

import { Map as MapScreen } from '../screens'
import { BaseTabParamList } from './Base';

import { BusInfo } from './BusInfo'

export type MapStackParamList = {
  Map: {},
  BusInfo: { bus: BusData }
}

export type MapStackNav = BottomTabNavigationProp<BaseTabParamList, 'Map'>
type MapStackRoute = RouteProp<BaseTabParamList, 'Map'>

type MapProps = {
  navigation: MapStackNav,
  route: MapStackRoute
}

export function Map(props: MapProps) {
  const Stack = createStackNavigator<MapStackParamList>();

  return (
    <Stack.Navigator initialRouteName="Map">
      <Stack.Screen name="Map" component={MapScreen} options={{ title: '', headerLeft: (props) => <TitleButtons stackProps={props} /> }} />
      <Stack.Screen name="BusInfo" component={BusInfo} />
    </Stack.Navigator>
  )
}