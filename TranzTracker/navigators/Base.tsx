import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { Map } from '../screens'

export function Base() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Map">
      <Stack.Screen name="Map" component={Map} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}