import React from 'react'
import { Text } from 'react-native'

import { Callout } from 'react-native-maps';
import { BusData } from '../interfaces';
import { MapNavigation } from '../screens';

interface BusCalloutProps {
  bus: BusData,
  navigation: MapNavigation
}

interface BusCalloutState {}

export class BusCallout extends React.Component<BusCalloutProps, BusCalloutState> {
  render() {
    return (
      <Callout onPress={() => this.props.navigation.navigate('BusInfo', { bus: this.props.bus })}>
        <Text>{this.props.bus.vehicle.label}</Text>
      </Callout>
    )
  }
}