import React from 'react'
import { Text } from 'react-native'

import { Callout } from 'react-native-maps';
import { BusData } from '../interfaces';
import { MapNavigation } from '../screens';
import { grey, isDark, Page } from '../styles';

interface BusCalloutProps {
  bus: BusData,
  navigation: MapNavigation
}

interface BusCalloutState {}

export class BusCallout extends React.Component<BusCalloutProps, BusCalloutState> {
  render() {
    return (
      <Callout tooltip={true} style={{
        backgroundColor: isDark ? grey : 'white'
      }} onPress={() => this.props.navigation.navigate('Bus Info', { bus: this.props.bus })}>
        <Text style={Page.text}>{this.props.bus.vehicle.label}</Text>
      </Callout>
    )
  }
}