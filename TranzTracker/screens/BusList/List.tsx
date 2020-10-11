import React from 'react';
import { ListRenderItem, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Spinner } from '../../components';
import { BusListContext } from '../../context/BusListContext';
import { BusData } from '../../interfaces';
import { Page } from '../../styles';

type ListProps = {}
type ListState = {}

export class List extends React.Component<ListProps, ListState> {
  static contextType = BusListContext
  context!: React.ContextType<typeof BusListContext>
  
  state: ListState = {}

  renderItem({ item }: { item: BusData }) {
    return null;
  }

  render() {
    if (this.context.loading) {
      return (<Spinner />)
    }

    return (
      <View style={Page.container}>
        <FlatList data={this.context.buses} renderItem={this.renderItem.bind(this)} keyExtractor={(item: BusData) => item.vehicle.id} />
      </View>
    );
  }
}