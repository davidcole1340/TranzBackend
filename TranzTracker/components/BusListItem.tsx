import React from 'react'
import { View, Text } from 'react-native'
import { BusListContext } from '../context/BusListContext'

import { getBusColor, getBusDelay, getBusDirection, OCCUPANCY_STRINGS } from '../helpers'
import { BusData } from '../interfaces'
import { List as ListStyle } from '../styles'

type BusListItemProps = {
  bus: BusData
}

export class BusListItem extends React.Component<BusListItemProps> {
  static contextType = BusListContext
  context!: React.ContextType<typeof BusListContext>

  getCurrentStop(): string|undefined {
    const stop = this.context.stops.find(stop => stop._id === this.props.bus.stop_time_update.stop_id)

    return stop?.stop_name || 'Unknown stop'
  }

  render() {
    return (
      <View style={{ ...ListStyle.item, borderColor: getBusColor(this.props.bus) }}>
        <View style={ListStyle.row}>
          <Text style={{ ...ListStyle.title, flex: 1 }}>{this.props.bus.vehicle.label}</Text>
          <Text style={{ ...ListStyle.text, flex: 2 }}>{getBusDelay(this.props.bus)}</Text>
          <Text style={{ ...ListStyle.text, flex: 2 }}>{OCCUPANCY_STRINGS[this.props.bus.occupancy_status]}</Text>
        </View>
        
        <View style={ListStyle.row}>
          <Text style={{ ...ListStyle.title, flex: 1 }}></Text>
          <Text style={{ ...ListStyle.text, flex: 2 }}>{this.getCurrentStop()}</Text>
          <Text style={{ ...ListStyle.text, flex: 2 }}></Text>
        </View>
      </View>
    )
  }
}