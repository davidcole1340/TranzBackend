import React from 'react'
import MapView, { Region } from 'react-native-maps'

import { Map as Styles } from '../styles'
import { GetLocation } from '../helpers/location'
import { View } from 'react-native';

interface MapState {
  region: Region
}

export class Map extends React.Component<{}, MapState> {
  state = {
    region: {
      latitude: -36.7495296,
      longitude: 174.6525451,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
  }

  componentDidMount() {
    // Get location and set. If it can't be found, use default.
    GetLocation().then(region => {
      this.setState({region: region})
    }).catch()
  }

  render() {
    return (
      <MapView
        style={Styles.container}
        region={this.state.region}
        onRegionChange={(r) => this.setState({ region: r })}
      />
    )
  }
}