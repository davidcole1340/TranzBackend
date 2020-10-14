import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { getIcon } from '../helpers';
import { Map, List } from '../screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { BaseStackParamList } from './Base';
import { RouteProp } from '@react-navigation/native';
import { BusData } from '../interfaces';
import { CheckIns } from '../screens/CheckIns';

type MapTabNavigator = StackNavigationProp<BaseStackParamList, 'Map'>
type MapTabRoute = RouteProp<BaseStackParamList, 'Map'>

type MapTabProps = {
  navigation: MapTabNavigator,
  route: MapTabRoute
}

export type MapTabParamList = {
  Map: {
    centerBus: BusData
  },
  'Bus List': {}
}

const Tab = createBottomTabNavigator();

export class MapTab extends React.Component<MapTabProps> {
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Map" component={Map} options={{
          tabBarIcon: getIcon('md-map')
        }} />
        <Tab.Screen name="Bus List" component={List} options={{
          tabBarIcon: getIcon('md-list')
        }} />
        <Tab.Screen name="Check-ins" component={CheckIns} options={{
          tabBarIcon: getIcon('md-checkmark-circle')
        }} />
      </Tab.Navigator>
    )
  }
}