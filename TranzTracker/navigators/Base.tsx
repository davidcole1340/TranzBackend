import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { TitleButtons } from '../components';
import { BusData } from '../interfaces';

import { Map } from '../screens'

import { BusInfo } from './BusInfo'

export type BaseStackParamList = {
  Map: undefined,
  BusInfo: { bus: BusData }
}

export function Base() {
  const Stack = createStackNavigator<BaseStackParamList>();

  return (
    <Stack.Navigator initialRouteName="Map">
      <Stack.Screen name="Map" component={Map} options={{ title: '', headerLeft: (props) => <TitleButtons stackProps={props} /> }} />
      <Stack.Screen name="BusInfo" component={BusInfo} />
    </Stack.Navigator>
  )
}