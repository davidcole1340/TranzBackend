import React from 'react'
import MapView from 'react-native-maps'

import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { BusData } from '../interfaces'
import { Map as Styles } from '../styles'
import * as Location from '../helpers/location'

import { BusMarker } from '../components'
import { MapStackParamList } from '../navigators'
import { BusListContext } from '../context/BusListContext'

export type MapNavigation = StackNavigationProp<MapStackParamList, 'Map'>
type MapRoute = RouteProp<MapStackParamList, 'Map'>

type MapProps = {
  navigation: MapNavigation,
  route: MapRoute
}

export class Map extends React.Component<MapProps> {
  static contextType = BusListContext
  context!: React.ContextType<typeof BusListContext>

  map: MapView | null = null;

  componentDidMount() {
    if (this.map !== null) {
      // Get location and set. If it can't be found, do nothing.
      Location.getLocation()
      .then(region => this.map?.animateToRegion(region))
      .catch()
    }
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
        {this.context.buses.map((bus: BusData) => (
          <BusMarker key={bus.vehicle.id} bus={bus} navigation={this.props.navigation} />
        ))}
      </MapView>
    )
  }
}