import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TripInfo } from "../screens";
import { StackNavigationProp } from '@react-navigation/stack';
import { BaseStackParamList } from '.';
import { RouteProp } from '@react-navigation/native';
import { BusData } from '../interfaces';

type BusInfoNavigator = StackNavigationProp<BaseStackParamList, 'BusInfo'>
type BusInfoRoute = RouteProp<BaseStackParamList, 'BusInfo'>

type BusInfoProps = {
  navigation: BusInfoNavigator,
  route: BusInfoRoute
}

export type BusInfoParamList = {
  TripInfo: {
    bus: BusData
  },
  Map: {}
}

export function BusInfo(props: BusInfoProps) {
  const Tab = createBottomTabNavigator<BusInfoParamList>()

  return (
    <Tab.Navigator>
      <Tab.Screen name="TripInfo" component={TripInfo} initialParams={props.route.params} />
    </Tab.Navigator>
  );
}