import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { getIcon } from '../helpers';
import { Map, List } from '../screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { BaseStackParamList } from './Base';
import { RouteProp } from '@react-navigation/native';

type MapTabNavigator = StackNavigationProp<BaseStackParamList, 'Map'>
type MapTabRoute = RouteProp<BaseStackParamList, 'Map'>

type MapTabProps = {
  navigation: MapTabNavigator,
  route: MapTabRoute
}

export type MapTabParamList = {
  Map: {},
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
      </Tab.Navigator>
    )
  }
}