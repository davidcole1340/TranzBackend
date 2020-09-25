import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Map from './screens/Map';
import BusInfo from './screens/BusInfo';
import ShiftInfo from './screens/ShiftInfo';
import { BusContext } from './BusContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Info({ route }) {
  return (
    <BusContext.Provider value={route.params}>
      <Tab.Navigator>
        <Stack.Screen name="BusInfo" component={BusInfo} />
        <Stack.Screen name="ShiftInfo" component={ShiftInfo} />
      </Tab.Navigator>
    </BusContext.Provider>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator>
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Info" component={Info} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}