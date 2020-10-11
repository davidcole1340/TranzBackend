import React from 'react'

import { BusData } from '../interfaces'

import { Marker, MarkerProps } from 'react-native-maps'
import { BusCallout } from './BusCallout'
import { MapNavigation } from '../screens'
import { grey, isDark } from '../styles'

interface BusMarkerProps {
  bus: BusData,
  navigation: MapNavigation
}

interface BusMarkerState {}

export class BusMarker extends React.Component<BusMarkerProps, BusMarkerState> {
  baseMarker?: Marker|null

  getMarkerColor(): string {
    if (this.props.bus.occupancy_status < 1) return isDark ? grey : 'black'
    else if (this.props.bus.occupancy_status < 2) return 'green'
    else if (this.props.bus.occupancy_status < 3) return 'orange';

    return 'red';
  }

  render() {
    const props: MarkerProps = {
      coordinate: this.props.bus.position,
      title: this.props.bus.vehicle.id,
      description: this.props.bus.trip.trip_id,
      pinColor: this.getMarkerColor()
    }

    return (
      <Marker {...props} ref={marker => this.baseMarker = marker}>
        <BusCallout bus={this.props.bus} navigation={this.props.navigation} />
      </Marker>
    );
  }
}