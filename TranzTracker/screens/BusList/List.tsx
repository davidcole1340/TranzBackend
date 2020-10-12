import React from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { BusListContext } from '../../context/BusListContext';
import { getBusDelay, OCCUPANCY_STRINGS } from '../../helpers';
import { BusData } from '../../interfaces';
import { BaseStackParamList, MapTabParamList } from '../../navigators';
import { Page, List as ListStyle } from '../../styles';

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
        <View style={ListStyle.item}>
          <Text style={ListStyle.title}>{item.vehicle.label}</Text>
          <Text style={ListStyle.text}>{getBusDelay(item)}</Text>
          <Text style={ListStyle.text}>{OCCUPANCY_STRINGS[item.occupancy_status]}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return (
      <View style={Page.container}>
        <FlatList
          data={this.context.buses}
          style={ListStyle.container}
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