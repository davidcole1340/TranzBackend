import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Spinner } from '../../components';
import { BusListContext } from '../../context/BusListContext';
import { getBusDelay, OCCUPANCY_STRINGS } from '../../helpers';
import { BusData } from '../../interfaces';
import { BaseTabParamList } from '../../navigators';
import { BusListNav, BusListParamList } from '../../navigators/BusList';
import { Page, List as ListStyle } from '../../styles';


type ListNav = CompositeNavigationProp<
  BottomTabNavigationProp<BusListParamList, 'Bus List'>,
  BottomTabNavigationProp<BaseTabParamList>
>
type ListRoute = RouteProp<BusListParamList, 'Bus List'>

type ListProps = {
  navigation: ListNav,
  route: ListRoute
}

type ListState = {}

export class List extends React.Component<ListProps, ListState> {
  static contextType = BusListContext
  context!: React.ContextType<typeof BusListContext>
  
  state: ListState = {}

  _handlePress(bus: BusData) {
    this.props.navigation.navigate('Map', {
      screen: 'Map',
      params: {
        centerBus: bus
      }
    })
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