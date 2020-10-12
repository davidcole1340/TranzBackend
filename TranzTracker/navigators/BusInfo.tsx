import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { TripInfo } from "../screens";
import { BusData } from '../interfaces';
import { ShiftInfo } from '../screens/BusInfo/ShiftInfo';
import { getIcon } from '../helpers';
import { BaseStackParamList } from './Base';

type BusInfoNavigator = StackNavigationProp<BaseStackParamList, 'Bus Info'>
type BusInfoRoute = RouteProp<BaseStackParamList, 'Bus Info'>

type BusInfoProps = {
  navigation: BusInfoNavigator,
  route: BusInfoRoute
}

export type BusInfoParamList = {
  Trip: {
    bus: BusData
  },
  Shift: {
    bus: BusData
  }
}

const Tab = createBottomTabNavigator<BusInfoParamList>()

export class BusInfo extends React.Component<BusInfoProps> {
  componentDidMount() {
    this.props.navigation.setOptions({
      title: this.props.route.params.bus.vehicle.label
    })
  }

  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Trip" component={TripInfo} initialParams={this.props.route.params} options={{
          tabBarIcon: getIcon('md-paper')
        }} />
        <Tab.Screen name="Shift" component={ShiftInfo} initialParams={this.props.route.params} options={{
          tabBarIcon: getIcon('md-bus')
        }} />
      </Tab.Navigator>
    );
  }
}

