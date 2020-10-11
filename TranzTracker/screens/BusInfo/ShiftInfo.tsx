import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import React from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Row, Rows, Table } from 'react-native-table-component';
import { getShift } from '../../api';
import { Spinner } from '../../components';
import { getTime } from '../../helpers';
import { Break, Shift, Split, Trip } from '../../interfaces/tranzit';
import { BusInfoParamList } from '../../navigators';
import { Page, Table as TableStyle } from '../../styles';

type ShiftInfoNavigator = StackNavigationProp<BusInfoParamList, 'Shift'>
type ShiftInfoRoute = RouteProp<BusInfoParamList, 'Shift'>

type ShiftInfoProps = {
  navigation: ShiftInfoNavigator,
  route: ShiftInfoRoute
}

type ShiftInfoState = {
  isLoading: boolean,
  shift?: Shift
}

const Routes: { [key: string]: string } = {
  20003: 'Albany to City',
  20005: 'Constellation to City',
  20007: 'HBC to City',
  20008: 'City to Albany',
  20010: 'City to Albany',
  20012: 'City to Albany',
  20014: 'City to HBC',
  20016: 'City to HBC',
  20023: 'Albany to City',
  2660:  'Northcross to Silverdale',
  0: 'Taxi to Depot',
  1: 'Taxi to City'
};

export class ShiftInfo extends React.Component<ShiftInfoProps, ShiftInfoState> {
  state: ShiftInfoState = {
    isLoading: true
  }

  componentDidMount() {
    // Call GraphQL to retrieve shift information
    getShift(this.props.route.params.bus).then((shift) => {
      this.setState({ shift: shift })
    }).catch((e: Error) => {
      alert(e.message)
    }).finally(() => {
      this.setState({ isLoading: false })
    })
  }

  time(a: Trip|Break, start: boolean = true): string {
    return getTime(a, start).format('h:mm a')
  }

  renderTrip(trip: Trip): string[] {
    return [
      (trip.route) ? `${trip.route} ${Routes[trip.route_id]}` : `Special to ${trip.destination}`,
      this.time(trip)
    ]
  }

  renderBreak(_break: Break): string[] {
    return [
      (_break.paid) ? `Paid break` : `Unpaid break`,
      `${this.time(_break)} - ${this.time(_break, false)}`
    ]
  }

  renderData(data: (Trip | Break)[]): string[][] {
    return data.map(piece => {
      if ((piece as Trip).time) {
        return this.renderTrip(piece as Trip)
      } else {
        return this.renderBreak(piece as Break)
      }
    })
  }

  renderSplit(split: Split) {
    const trips = [...split.trips, ...split.breaks]
    trips.sort((a, b) => {
      const timeA = getTime(a)
      const timeB = getTime(b)

      if (timeA == timeB) {
        if ((a as Trip).time) {
          return 1
        }
        return -1
      } else {
        if (timeA.isBefore(timeB)) {
          return -1;
        }
        return 1;
      }
    })

    return (
      <View key={split._id}>
        <Text style={Page.title}>Sign on: {moment(split.sign_on, 'hhmm').format('h:mm a')}</Text>
        <Table borderStyle={TableStyle.border}>
          <Row data={['Trip', 'Start Time']} style={TableStyle.header} textStyle={TableStyle.headerText} />
          <Rows data={this.renderData(trips)} textStyle={Page.text} />
        </Table>
        <Text style={Page.title}>Sign off: {moment(split.sign_off, 'hhmm').format('h:mm a')}</Text>
      </View>
    )
  }

  render() {
    if (this.state.isLoading) {
      return (<Spinner />)
    } else if (! this.state.shift) {
      return (<Text style={{ ...Page.title, ...Page.container }}>Shift information unavailable.</Text>)
    }

    const hours = Math.floor(this.state.shift.hours_worked)
    const mins = Math.floor(this.state.shift.hours_worked * 100 % 100)
    
    return (
      <View style={Page.container}>
        <Text style={Page.title}>{this.state.shift._id}</Text>
        <Text style={Page.text}>Hours worked: {hours} hrs {mins} min</Text>

        <ScrollView>
          {this.state.shift.splits.map(this.renderSplit.bind(this))}
        </ScrollView>
      </View>
    );
  }
}