import React from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { BusContext } from '../BusContext';
import moment from 'moment';

import { styles } from './Map';

const OCCUPANCY_STRINGS = {
  0: 'No passengers',
  1: 'Many seats available',
  2: 'Few seats available',
  3: 'Standing room only',
  4: 'Minimal standing room only',
  5: 'Bus full',
  6: 'Bus not accepting passengers'
};

const DIRECTION_CITY = 0;
const DIRECTION_ALBANY = 1;
const SHOW_ALL = 2;

const SCHEDULED_TIMES = 0;
const PREDICTED_TIMES = 1;

class BusInfo extends React.Component {
  static contextType = BusContext;

  componentDidMount() {
    this.props.navigation.setOptions({ headerTitle: this.context.bus.vehicle.label });
  }

  BusDelay(props) {
    if (props.bus.stop_time_update == null) {
      return (<Text style={styles.text}>No delay information available</Text>);
    }
  
    if (props.bus.stop_time_update.arrival != null) {
      var delay = props.bus.stop_time_update.arrival.delay;
    } else if (props.bus.stop_time_update.departure != null) {
      var delay = props.bus.stop_time_update.departure.delay;
    } else {
      return (<Text style={styles.text}>No delay information available</Text>);
    }
  
    var output, minutes, seconds;
  
    if (delay < 0) {
      output = 'Ahead of schedule by ';
      delay = 0 - delay;
    } else {
      output = 'Behind schedule by ';
    }
  
    minutes = Math.floor(delay / 60);
    seconds = delay - minutes * 60;
  
    output += minutes + ' min ' + seconds + ' sec';
  
    return (
      <Text style={styles.text}>{output}</Text>
    );
  }

  render() {
    let directionLabel;

    if (this.context.bus.trip == null) {
      directionLabel = 'Not in Service';
    } else {
      switch (this.context.bus.trip.direction_id) {
        case DIRECTION_CITY:
          directionLabel = 'City-bound';
          break;
        case DIRECTION_ALBANY:
          directionLabel = 'Albany-bound';
          break;
      }
    }

    return (
      <View style={{ flex: 1, margin: 6 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, ...styles.text }}>{this.context.bus.vehicle.label} - {this.context.bus.vehicle.license_plate} - {this.context.bus.shift ? this.context.bus.shift.shift_id : this.context.bus.vehicle.id}</Text>
        <Text style={styles.text}>{directionLabel} - {Math.floor(this.context.bus.position.speed * 3.6)} km/h</Text>
        <Text style={styles.text}>{OCCUPANCY_STRINGS[this.context.bus.occupancy_status]}</Text>

        {Object.values(this.context.bus.stops).length < 1 ? (<ActivityIndicator size="large" color="#000000" />) : null}
        <this.BusDelay bus={this.context.bus} />

        <ScrollView>
          <Table borderStyle={styles.tableBorder}>
            <Row data={['Stop', 'Time']} style={styles.tableHeader} textStyle={styles.text} />
            {Object.values(this.context.bus.stops).map(stop => (
              <Row key={stop.stop_id} textStyle={{ ...styles.text, ...this.getTimetableStyles(this.context.bus, stop) }} data={[ stop.stop_name, this.getArrivalTime(this.context.bus, stop)]} />
            ))}
          </Table>
        </ScrollView>
      </View>
    );
  }

  getTimetableStyles(bus, stop) {
    if (bus.stop_time_update.stop_sequence == stop.stop_sequence) return { color: 'blue' };
    if ((bus.stop_time_update.stop_sequence + 1) == stop.stop_sequence) return { color: 'red' };

    return {};
  }

  getArrivalTime(bus, stop) {
    if (this.context.times == SCHEDULED_TIMES || bus.stop_time_update == null || (bus.stop_time_update.departure != null && bus.stop_time_update.arrival)) return stop.arrival_time;
  
    var time = moment(stop.arrival_time, 'HH:mm:ss');
  
    if (bus.stop_time_update.arrival != null) {
      return time.add(bus.stop_time_update.arrival.delay, 'seconds').format('HH:mm:ss');
    } else if (bus.stop_time_update.departure != null) {
      return time.add(bus.stop_time_update.departure.delay, 'seconds').format('HH:mm:ss');
    }
    }
}

export default BusInfo;