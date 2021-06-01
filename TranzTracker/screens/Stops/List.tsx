import React from 'react';
import { Text, View } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { BusListContext } from '../../context/BusListContext';
import { Stop } from '../../interfaces/gtfs';
import { Page, List as ListStyle } from '../../styles';

export class List extends React.Component<{}> {
  static contextType = BusListContext;
  context!: React.ContextType<typeof BusListContext>

  renderStop({ item, index, separators }: { item: Stop, index: number, separators: Object }) {
    return (
      <View style={ListStyle.item}>
        <Text style={ListStyle.title}>{item.stop_name}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={Page.container}>
        <FlatList
          renderItem={this.renderStop.bind(this)}
          data={this.context.stops}
        />
      </View>
    )
  }
}