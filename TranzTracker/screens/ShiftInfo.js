import React from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { BusContext } from '../BusContext';
import { API, styles } from './Map';
import moment from 'moment';
import { Table, Row } from 'react-native-table-component';

const Routes = {
  20003: 'Albany to City',
  20005: 'Constellation to City',
  20007: 'HBC to City',
  20008: 'City to Albany',
  20012: 'City to Albany',
  20014: 'City to HBC',
  20016: 'City to HBC',
  20023: 'Albany to City',
  2660:  'Northcross to Silverdale',
  0: 'Taxi to Depot',
  1: 'Taxi to City'
};

class ShiftInfo extends React.Component {
  static contextType = BusContext;

  componentDidMount() {
    if (! this.context.bus.full_shift) {
      fetch(API.SHIFT_INFO + this.context.bus.shift.shift_id, { method: 'GET' })
      .then(response => response.json())
      .then(shift => {
        this.context.bus.full_shift = shift;
        this.forceUpdate();
      });
    }
  }

  generateTimetableStyles(items) {
    let currentTime = moment();
    let _styles = { red: null, blue: null };

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let itemTime = moment(item.start ? item.start : item.time, 'hh:mm:ss');

      if (currentTime.isBefore(itemTime)) {
        _styles.red = i;

        if (i > 0) {
          _styles.blue = i-1;
        }

        break;
      }
    }

    return _styles;
  }

  renderTrip(trip, index, _styles) {
    let data = [];
    let newStyles = {...styles.text};

    // Trip is a break
    if (trip.break_id) {
      data = [(trip.paid ? 'Paid' : 'Unpaid') + ' break', `${trip.start} - ${trip.finish}`];
    } else {
      if (trip.route) {
        data = [`${trip.route} ${Routes[trip.route_id]}`, trip.time];
      } else {
        data = [`Special to ${trip.destination}`, trip.time];
      }
    }

    if (_styles.red == index) newStyles.color = 'red';
    if (_styles.blue == index) newStyles.color = 'blue';

    return (<Row key={trip.trip_id ? trip.trip_id : trip.break_id} data={data} textStyle={newStyles} />);
  }

  renderSplit(split) {
    const items = [ ...split.breaks, ...split.trips ];
    items.sort((a, b) => {
      let ta = moment(a.start ? a.start : a.time, 'hh:mm:ss');
      let tb = moment(b.start ? b.start : b.time, 'hh:mm:ss');

      if (ta == tb) {
        // If A is a break, it goes after.
        if (a.break_id && b.trip_id) return 1;
        if (a.trip_id && b.break_id) return -1;

        return 0;
      }

      if (ta.isBefore(tb)) return -1;
      return 1;
    });

    let _styles = this.generateTimetableStyles(items);

    return (
      <View key={split.split_id} styles={styles.container}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, ...styles.text }}>Sign On: {split.sign_on}</Text>

        <Table borderStyle={styles.tableBorder}>
          <Row data={['Destination', 'Time']} style={styles.tableHeader} textStyle={styles.text} />
          {items.map((item, i) => this.renderTrip(item, i, _styles))}
        </Table>

        <Text style={{ fontWeight: 'bold', fontSize: 20, ...styles.text }}>Sign Off: {split.sign_off}</Text>
      </View>
    );
  }

  render() {
    if (! this.context.bus.full_shift) {
      return (
        <View style={{ ...styles.container, ...styles.info }}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      );
    }

    let shift = this.context.bus.full_shift;

    return (
      <View style={{ flex: 1, margin: 6 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 25, ...styles.text}}>{shift.shift_id} - {shift.hours_worked} hrs</Text>
        <ScrollView>
          {shift.splits.map(this.renderSplit.bind(this))}
        </ScrollView>
      </View>
    );
  }
}

export default ShiftInfo;