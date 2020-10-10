import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { TitleButtons } from '../components';
import { BusData } from '../interfaces';

import { Map as MapScreen } from '../screens'

import { BusInfo } from './BusInfo'

export type MapStackParamList = {
  Map: undefined,
  BusInfo: { bus: BusData }
}

export function Map() {
  const Stack = createStackNavigator<MapStackParamList>();

  return (
    <Stack.Navigator initialRouteName="Map">
      <Stack.Screen name="Map" component={MapScreen} options={{ title: '', headerLeft: (props) => <TitleButtons stackProps={props} /> }} />
      <Stack.Screen name="BusInfo" component={BusInfo} />
    </Stack.Navigator>
  )
}