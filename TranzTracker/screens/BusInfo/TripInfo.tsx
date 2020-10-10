import React from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Row, Rows, Table } from 'react-native-table-component'

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { BusInfoParamList } from "../../navigators";
import { Page, Table as TableStyle } from '../../styles'
import { BusData } from "../../interfaces";
import { getBusDelay, getBusDirection } from "../../helpers";
import { getBusStops } from "../../api";
import { TripQuery } from "../../interfaces/queries";
import { GTFSTrip } from "../../interfaces/gtfs";
import { Spinner } from "../../components";

type TripInfoNavigator = StackNavigationProp<BusInfoParamList, 'Trip'>
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

    if (this.state.tripInfo) {
      title += ` - ${this.state.tripInfo.shift._id}`
    }

    return title
  }

  renderTable() {
    if (this.state.isLoading) {
      return (<Spinner />)
    }
    if (! this.state.tripInfo) {
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

  render() {
    const bus: BusData = this.props.route.params.bus;

    return (
      <View style={Page.container}>
        <Text style={Page.title}>{this.renderTitle()}</Text>
        <Text style={Page.text}>{getBusDelay(bus)} - {getBusDirection(bus)}</Text>

        <ScrollView>
          {this.renderTable()}
        </ScrollView>
      </View>
    )
  }
}