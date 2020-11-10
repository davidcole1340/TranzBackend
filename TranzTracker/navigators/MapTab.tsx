import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { getIcon } from '../helpers';
import { Map, List } from '../screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { BaseStackParamList } from './Base';
import { RouteProp } from '@react-navigation/native';
import { BusData } from '../interfaces';
import { CheckIns } from '../screens/CheckIns';
import { BusListContext } from '../context/BusListContext';

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
const doubleTapDelay = 250;

export class MapTab extends React.Component<MapTabProps> {
  static contextType = BusListContext
  context!: React.ContextType<typeof BusListContext>

  lastTap?: number

  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Map" component={Map} options={{
          tabBarIcon: getIcon('md-map')
        }} listeners={({ navigation, route }) => ({
          tabPress: this.handleTap.bind(this)
        })} />
        <Tab.Screen name="Bus List" component={List} options={{
          tabBarIcon: getIcon('md-list')
        }} />
        <Tab.Screen name="Check-ins" component={CheckIns} options={{
          tabBarIcon: getIcon('md-checkmark-circle')
        }} />
      </Tab.Navigator>
    )
  }

  handleTap() {
    const now = Date.now()

    if (this.lastTap && ! this.context.loading) {
      console.log(now - this.lastTap);
      if ((now - this.lastTap) <= doubleTapDelay) {
        this.context.updateVehicleLocations()
      }
    }

    this.lastTap = now;
  }
}