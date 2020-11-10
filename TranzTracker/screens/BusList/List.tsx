import React from 'react';
import { RefreshControl, SectionList, SectionListData, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { BusListContext } from '../../context/BusListContext';
import { BusData } from '../../interfaces';
import { BaseStackParamList, MapTabParamList } from '../../navigators';
import { Page, List as ListStyle } from '../../styles';
import { BusListItem } from '../../components/BusListItem';
import { BusDirection, getStopOrder } from '../../helpers/functions'

import * as _ from 'underscore'

export type ListNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<MapTabParamList, 'Bus List'>,
  StackNavigationProp<BaseStackParamList>
>
type ListRoute = RouteProp<MapTabParamList, 'Bus List'>

type ListProps = {
  navigation: ListNavigation,
  route: ListRoute
}

type ListState = {}

export abstract class List extends React.Component<ListProps, ListState> {
  abstract direction: BusDirection

  static contextType = BusListContext
  context!: React.ContextType<typeof BusListContext>
  
  state: ListState = {}

  _handlePress(bus: BusData) {
    this.props.navigation.navigate('Map', { centerBus: bus });
  }

  renderItem({ item }: { item: BusData }) {
    return (
      <TouchableWithoutFeedback onPress={this._handlePress.bind(this, item)}>
        <BusListItem bus={item} />
      </TouchableWithoutFeedback>
    );
  }

  getData(): BusData[] {
    return this.context.buses.filter(bus => bus.trip.direction_id == this.direction)
  }

  render() {
    const sections: SectionListData<BusData, {
      title: string,
      data: BusData[],
      seq: number
    }>[] = []

    Object.entries(_.groupBy(this.getData(), (bus) => {
      return bus.stop_time_update.stop_id
    })).forEach(([ stop_id, buses ]) => {
      const stop = (() => {
        const stop = this.context.stops.find(stop => {
          return stop._id == stop_id
        })

        return stop
      })()

      sections.push({
        title: stop ? stop.stop_name : 'Unknown Stop',
        data: buses,
        seq: getStopOrder(stop?._id ? stop._id : '', this.direction)
      })
    });

    return (
      <View style={Page.container}>
        <SectionList
          sections={sections.sort((a, b) => {
            return (a.seq > b.seq) ? 1 : -1
          })}
          style={ListStyle.container}
          renderSectionHeader={(info) => (
            <View style={{ ...ListStyle.item, ...ListStyle.headerContainer }}>
              <Text style={{ ...ListStyle.title, ...ListStyle.headerTitle }}>{info.section.title}</Text>
            </View>
          )}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item: BusData) => item.vehicle.id}
          refreshControl={
            <RefreshControl
              refreshing={this.context.loading}
              onRefresh={this.context.updateVehicleLocations}
            />
          }
        />
      </View>
    );
  }
}