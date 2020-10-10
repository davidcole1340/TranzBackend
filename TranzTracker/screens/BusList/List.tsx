import React from 'react';
import { View } from 'react-native';
import { Spinner } from '../../components';
import { BusListContext } from '../../context/BusListContext';
import { Page } from '../../styles';

type ListProps = {}
type ListState = {}

export class List extends React.Component<ListProps, ListState> {
  static contextType = BusListContext
  context!: React.ContextType<typeof BusListContext>
  
  state: ListState = {}

  render() {
    if (this.context.loading) {
      return (<Spinner />)
    }

    return (
      <View style={Page.container}>
      </View>
    );
  }
}