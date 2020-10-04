import React from 'react'
import MapView, { Marker, Region } from 'react-native-maps'

import { Map as Styles } from '../styles'
import * as Location from '../helpers/location'
import * as Api from '../api'

interface State {
  buses: Api.BusData[]
}

export class Map extends React.Component<{}, State> {
  state = {
    buses: []
  }

  map: MapView | null = null;

  componentDidMount() {
    if (this.map !== null) {
      // Get location and set. If it can't be found, use default.
      Location.getLocation()
      .then(region => this.map?.animateToRegion(region))
      .catch()
    }

    Api.getVehicleLocations()
    .then(buses => this.setState({ buses: buses }))
    .catch(e => alert(e.message))
  }

  renderBus(bus: Api.BusData) {
    return (
      <Marker
        key={bus.vehicle.id}
        coordinate={bus.position}
        title={bus.vehicle.id}
        description={bus.trip.trip_id}
      />
    );
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
        {this.state.buses.map(this.renderBus.bind(this))}
      </MapView>
    )
  }
}