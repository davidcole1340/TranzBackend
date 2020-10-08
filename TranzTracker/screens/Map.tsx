import React from 'react'
import MapView from 'react-native-maps'

import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { BusData } from '../interfaces'
import { Map as Styles } from '../styles'
import * as Location from '../helpers/location'
import * as Api from '../api'

import { BusMarker } from '../components'
import { BaseStackParamList } from '../navigators'

export type MapNavigation = StackNavigationProp<BaseStackParamList, 'Map'>
type MapRoute = RouteProp<BaseStackParamList, 'Map'>

type MapProps = {
  navigation: MapNavigation,
  route: MapRoute
}

type MapState = {
  buses: BusData[]
}

export class Map extends React.Component<MapProps, MapState> {
  state: MapState = {
    buses: []
  }

  map: MapView | null = null;

  componentDidMount() {
    if (this.map !== null) {
      // Get location and set. If it can't be found, do nothing.
      Location.getLocation()
      .then(region => this.map?.animateToRegion(region))
      .catch()
    }

    this.updateVehicleLocations()
  }

  updateVehicleLocations() {
    Api.getVehicleLocations()
    .then((buses: BusData[]) => this.setState({ buses: buses }))
    .catch((e: Error) => alert(e.message))
  }

  render() {
    return (
      <MapView
        style={Styles.container}
        ref={map => this.map = map}
        initialRegion={{
          latitude: -36.7495296,
          longitude: 174.6525451,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      >
        {this.state.buses.map((bus: BusData) => (
          <BusMarker key={bus.vehicle.id} bus={bus} navigation={this.props.navigation} />
        ))}
      </MapView>
    )
  }
}