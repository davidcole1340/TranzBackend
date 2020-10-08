import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { BusData } from '../interfaces';

import { Map } from '../screens'
import { BusInfo } from '../screens/BusInfo';

export type BaseStackParamList = {
  Map: undefined,
  BusInfo: { bus: BusData }
}

export function Base() {
  const Stack = createStackNavigator<BaseStackParamList>();

  return (
    <Stack.Navigator initialRouteName="Map">
      <Stack.Screen name="Map" component={Map} options={{ headerShown: false }} />
      <Stack.Screen name="BusInfo" component={BusInfo} />
    </Stack.Navigator>
  )
}