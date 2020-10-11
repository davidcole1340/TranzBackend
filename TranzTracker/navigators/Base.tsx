import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Map as MapNavigator } from "./Map";
import { getIcon } from '../helpers';
import { BusList } from './BusList';
import { BusData } from '../interfaces';
import { getVehicleLocations } from '../api';
import { BusListContext, BusListContextType } from '../context/BusListContext';

export type BaseTabParamList = {
  Map: {},
  'Bus List': {
    updateVehicleLocations: () => void
  }
}

const Tab = createBottomTabNavigator<BaseTabParamList>()

export class Base extends React.Component<{}, BusListContextType> {
  static contextType = BusListContext
  context!: React.ContextType<typeof BusListContext>

  state: BusListContextType = {
    loading: false,
    buses: [],
    updateVehicleLocations: this.updateVehicleLocations.bind(this)
  }

  updateVehicleLocations() {
    if (this.state.loading) {
      console.log('Already updating, skipping.')
      return
    }

    console.log('Updating vehicle locations')
    this.setState({ loading: true })

    getVehicleLocations()
    .then((buses: BusData[]) => this.setState({ buses: buses }))
    .catch((e: Error) => alert(e.message))
    .finally(() => this.setState({ loading: false }))
  }

  render() {
    return (
      <BusListContext.Provider value={this.state}>
        <Tab.Navigator>
          <Tab.Screen name="Map" component={MapNavigator} options={{
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
