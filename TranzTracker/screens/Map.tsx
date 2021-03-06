import React from 'react'
import MapView from 'react-native-maps'

import { CompositeNavigationProp, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

import { BusData } from '../interfaces'
import { isDark, Map as Styles } from '../styles'
import * as Location from '../helpers/location'

import { BusMarker } from '../components'
import { BusListContext } from '../context/BusListContext'
import IMap from '../helpers/IMap'
import { asyncDelay } from '../helpers'
import { BaseStackParamList, MapTabParamList } from '../navigators'
import { Platform } from 'react-native'
import { DarkMode, LightMode } from '../helpers/GoogleMapsStyles'

export type MapNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<MapTabParamList, 'Map'>,
  StackNavigationProp<BaseStackParamList>
>
type MapRoute = RouteProp<MapTabParamList, 'Map'>

type MapProps = {
  navigation: MapNavigation,
  route: MapRoute
}

export class Map extends React.Component<MapProps> {
  static contextType = BusListContext
  context!: React.ContextType<typeof BusListContext>

  map: MapView | null = null
  markers: IMap<BusMarker> = new IMap<BusMarker>((item) => item.props.bus.vehicle.id)

  componentDidUpdate() {
    if (this.props.route.params?.centerBus) {
      const bus = this.props.route.params.centerBus
      this.props.navigation.setParams({ centerBus: undefined })
      this.map?.animateToRegion(Location.gtfsPositionToRegion(bus.position), 750)

      asyncDelay(800).then(() => {
        const marker = this.markers.get(bus.vehicle.id)
        if (marker) {
          marker.baseMarker?.showCallout()
        }
      })
    }
  }

  componentDidMount() {
    this.context.updateVehicleLocations()

    if (this.map !== null) {
      // Get location and set. If it can't be found, do nothing.
      Location.getRegionLocation()
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
        customMapStyle={Platform.OS == "android" && isDark ? DarkMode : LightMode}
      >
        {this.context.buses.map((bus: BusData) => (
          <BusMarker key={bus.vehicle.id} bus={bus} navigation={this.props.navigation} ref={marker => {
            if (marker) {2
              this.markers.push(marker)
            }
          }} />
        ))}
      </MapView>
    )
  }
}