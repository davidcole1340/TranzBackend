import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { TitleButtons } from '../components';
import { BusData, Position } from '../interfaces';

import { Map as MapScreen } from '../screens'
import { BaseTabParamList } from './Base';

import { BusInfo } from './BusInfo'

export type MapStackParamList = {
  Map: {
    centerLocation?: Position
  },
  BusInfo: { bus: BusData }
}

export type MapStackNav = BottomTabNavigationProp<BaseTabParamList, 'Map'>
type MapStackRoute = RouteProp<BaseTabParamList, 'Map'>

type MapProps = {
  navigation: MapStackNav,
  route: MapStackRoute
}

const Stack = createStackNavigator<MapStackParamList>();

export class Map extends React.Component<MapProps> {
  componentDidUpdate() {
    
  }
  
  render() {
    return (
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Map" component={MapScreen} options={{ title: '', headerLeft: (props) => <TitleButtons stackProps={props} /> }} />
        <Stack.Screen name="BusInfo" component={BusInfo} />
      </Stack.Navigator>
    )
  }
}
