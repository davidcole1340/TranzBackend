import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { List } from '../screens/BusList';

export type BusListParamList = {
  List: {}
}

export function BusList() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="List" component={List} />
    </Stack.Navigator>
  )
}