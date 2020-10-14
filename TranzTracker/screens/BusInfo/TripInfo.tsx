import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Row, Rows, Table } from 'react-native-table-component'

import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import * as Storage from '../../helpers/CheckInStorage'
import { BusInfoParamList } from "../../navigators";
import { Page, Table as TableStyle } from '../../styles'
import { BusData } from "../../interfaces";
import { getBusDelay, getBusDirection } from "../../helpers";
import { getBusStops } from "../../api";
import { TripQuery } from "../../interfaces/queries";
import { GTFSTrip } from "../../interfaces/gtfs";
import { Spinner } from "../../components";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type TripInfoNavigator = CompositeNavigationProp<
  BottomTabNavigationProp<BusInfoParamList, 'Trip'>,
  StackNavigationProp<BusInfoParamList>
>
type TripInfoRoute = RouteProp<BusInfoParamList, 'Trip'>

type TripInfoProps = {
  navigation: TripInfoNavigator,
  route: TripInfoRoute
}

type TripInfoState = {
  isLoading: boolean,
  tripInfo?: GTFSTrip
}

export class TripInfo extends React.Component<TripInfoProps, TripInfoState> {
  state: TripInfoState = {
    isLoading: true
  }

  componentDidMount() {
    if (! this.props.route.params.bus.trip) {
      this.setState({ isLoading: false })
    } else {
      getBusStops(this.props.route.params.bus).then((d: TripQuery) => {
        if (d.trip) {
          this.setState({ tripInfo: d.trip })
        }
      }).catch((e: Error) => {
        alert(e.message)
      }).finally(() => {
        this.setState({ isLoading: false })
      })
    }
  }

  renderTitle() {
    var title: string = this.props.route.params.bus.vehicle.label
    
    if (this.state.tripInfo?.shift) {
      title += ` - ${this.state.tripInfo.shift._id}`
    }

    return title
  }

  renderTable() {
    if (this.state.isLoading) {
      return (<Spinner />)
    } else if (! this.state.tripInfo) {
      return (<Text style={Page.text}>No trip information available.</Text>)
    }

    return (
      <Table borderStyle={TableStyle.border}>
        <Row data={['Destination', 'Time']} style={TableStyle.header} textStyle={TableStyle.headerText} />
        <Rows data={this.mapTableData()} textStyle={Page.text} />
      </Table>
    );
  }

  mapTableData(): string[][] {
    const output: string[][] = []

    this.state.tripInfo?.stop_times.sort((a, b) => {
      if (a.stop_sequence > b.stop_sequence) {
        return 1
      } else {
        return -1
      }
    })

    this.state.tripInfo?.stop_times.forEach(stop_time => {
      output.push([
        stop_time.stop.stop_name,
        stop_time.arrival_time
      ])
    })
    
    return output
  }

  renderAlert(bus: BusData) {
    Alert.alert('Check-in', `Are you sure you want to check-in to ${bus.vehicle.label}?`, [
      {
        text: 'Yes',
        onPress: () => Storage.addCheckIn(bus)
      },
      {
        text: 'Cancel',
        onPress: () => null
      }
    ]);
  }

  render() {
    const bus: BusData = this.props.route.params.bus;

    return (
      <View style={{ ...Page.container, flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, alignContent: 'flex-start'  }}>
            <Text style={Page.title}>{this.renderTitle()}</Text>
          </View>

          <View style={{ flex: 1, alignContent: 'flex-end' }}>
            <View style={{ borderRadius: 20, backgroundColor: '#007AFF' }}>
              <Button
                title="Check-in"
                color="black"
                onPress={this.renderAlert.bind(this, bus)}
              />
            </View>
          </View>
        </View>

        <Text style={Page.text}>{getBusDelay(bus)} - {getBusDirection(bus)}</Text>

        <ScrollView>
          {this.renderTable()}
        </ScrollView>
      </View>
    )
  }
}