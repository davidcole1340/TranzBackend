import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Map } from "./Map";
import { getIcon } from '../helpers';
import { BusList } from './BusList';
import { BusData } from '../interfaces';
import { getVehicleLocations } from '../api';
import { BusListContext } from '../context/BusListContext';

export type BaseTabParamList = {
  Map: {},
  'Bus List': {}
}

type BaseParams = {}
type BaseState = {
  loading: boolean,
  buses: BusData[]
}

export class Base extends React.Component<BaseParams, BaseState> {
  state: BaseState = {
    loading: true,
    buses: []
  }

  componentDidMount() {
    this.updateVehicleLocations()
  }

  updateVehicleLocations() {
    getVehicleLocations()
    .then((buses: BusData[]) => this.setState({ buses: buses }))
    .catch((e: Error) => alert(e.message))
    .finally(() => this.setState({ loading: false }))
  }

  render() {
    const Tab = createBottomTabNavigator<BaseTabParamList>()
  
    return (
      <BusListContext.Provider value={this.state}>
        <Tab.Navigator>
          <Tab.Screen name="Map" component={Map} options={{
            tabBarIcon: getIcon('md-map')
          }} />
          <Tab.Screen name="Bus List" component={BusList} options={{
            tabBarIcon: getIcon('md-list')
          }} />
        </Tab.Navigator>
      </BusListContext.Provider>
    )
  }
}
