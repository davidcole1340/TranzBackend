import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { BusData } from '../interfaces';
import { getVehicleLocations } from '../api';
import { BusListContext, BusListContextType } from '../context/BusListContext';
import { MapTab } from './MapTab';
import { BusInfo } from './BusInfo'
import { TitleButtons } from '../components';

export type BaseStackParamList = {
  Map: {
    centerBus: BusData
  },
  'Bus Info': {
    bus: BusData
  }
}

const Stack = createStackNavigator<BaseStackParamList>();

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
        <Stack.Navigator initialRouteName="Map">
          <Stack.Screen name="Map" component={MapTab} options={{
            title: '',
            headerLeft: (props) => <TitleButtons stackProps={props} />
          }} />
          <Stack.Screen name="Bus Info" component={BusInfo} /> 
        </Stack.Navigator>
      </BusListContext.Provider>
    )
  }
}
