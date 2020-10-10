import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TripInfo } from "../screens";
import { StackNavigationProp } from '@react-navigation/stack';
import { BaseStackParamList } from '.';
import { RouteProp } from '@react-navigation/native';
import { BusData } from '../interfaces';
import { ShiftInfo } from '../screens/ShiftInfo';
import { GTFSTrip } from '../interfaces/gtfs';
import { Ionicons } from '@expo/vector-icons';

type BusInfoNavigator = StackNavigationProp<BaseStackParamList, 'BusInfo'>
type BusInfoRoute = RouteProp<BaseStackParamList, 'BusInfo'>

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

const getIcon = (icon: string) => {
  return (props: { focused: boolean, color: string, size: number }): React.ReactNode => {
    return (
      <Ionicons name={icon} color={props.color} size={props.size} />
    )
  }
}

export function BusInfo(props: BusInfoProps) {
  const Tab = createBottomTabNavigator<BusInfoParamList>()

  React.useEffect(() => {
    props.navigation.setOptions({ title: props.route.params.bus.vehicle.label })
  })

  return (
    <Tab.Navigator>
      <Tab.Screen name="Trip" component={TripInfo} initialParams={props.route.params} options={{
        tabBarIcon: getIcon('md-paper')
      }} />
      <Tab.Screen name="Shift" component={ShiftInfo} initialParams={props.route.params} options={{
        tabBarIcon: getIcon('md-bus')
      }} />
    </Tab.Navigator>
  );
}