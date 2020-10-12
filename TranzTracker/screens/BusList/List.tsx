import React from 'react';
import { RefreshControl, SectionList, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { BusListContext } from '../../context/BusListContext';
import { BusData } from '../../interfaces';
import { BaseStackParamList, MapTabParamList } from '../../navigators';
import { Page, List as ListStyle } from '../../styles';
import { BusListItem } from '../../components/BusListItem';
import { BusDirection } from '../../helpers/functions'

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

export class List extends React.Component<ListProps, ListState> {
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

  render() {
    const city = this.context.buses
    .filter(bus => bus.trip.direction_id == BusDirection.City)
    .sort((a, b) => b.occupancy_status - a.occupancy_status)

    const albany = this.context.buses.filter(bus => bus.trip.direction_id == BusDirection.Albany)
    .sort((a, b) => b.occupancy_status - a.occupancy_status)

    return (
      <View style={Page.container}>
        <SectionList
          sections={[
            {
              title: 'City-bound',
              data: city
            },
            {
              title: 'Albany-bound',
              data: albany
            }
          ]}
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