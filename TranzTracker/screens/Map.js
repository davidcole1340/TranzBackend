import React from 'react';
import moment from 'moment';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Col, Grid } from 'react-native-easy-grid';

export const OCCUPANCY_STRINGS = {
  0: 'No passengers',
  1: 'Many seats available',
  2: 'Few seats available',
  3: 'Standing room only',
  4: 'Minimal standing room only',
  5: 'Bus full',
  6: 'Bus not accepting passengers'
};

export const API = {
  VEHICLE_LOCATION: 'https://api.at.govt.nz/v2/public/realtime/vehiclelocations',
  VEHICLE_INFO: 'https://api.at.govt.nz/v2/public/realtime/tripupdates',
  TRIP_INFO: 'https://dcol542.co/trips/',
  SHIFT_INFO: 'https://dcol542.co/shifts/'
};

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  info: { margin: 10 },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  callout: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 250
  },
  text: { margin: 6 },
  tableBorder: {
    borderWidth: 2,
    borderColor: '#000000'
  },
  tableHeader: {
    height: 40,
    backgroundColor: '#ffffff'
  }
});

const DIRECTION_CITY = 0;
const DIRECTION_ALBANY = 1;
const SHOW_ALL = 2;

const SCHEDULED_TIMES = 0;
const PREDICTED_TIMES = 1;

const AT_AUTH_KEY = 'dcefb8b705d24f1cbf22dc47599eb69d';

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: -36.7217189,
        longitude: 174.7036742,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      buses: [],              // Collection of buses
      view: SHOW_ALL,         // Show all buses or a certain direction
      times: SCHEDULED_TIMES, // Show scheduled or predicted times
      time: '',               // Current time,
      timer: null,            // Timer to update time
      navigation: props.navigation,
      refreshing: false
    };
  }

  componentDidMount() {
    this.timer = setInterval(this.updateTime.bind(this), 1000); // Updates the current time
    this.updateBusList();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updateBusList() {
    this.setState({ refreshing: true });

    // Fetch vehicle locations
    fetch(API.VEHICLE_LOCATION, {
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': AT_AUTH_KEY
      }
    })
    .then(response => response.json())
    .then(data => data.response.entity)
    .then(rawBuses => {
      let buses = [];

      // Collect tranzit buses
      rawBuses.forEach(bus => {
        if (! bus.vehicle.vehicle.label) return;
        let label = bus.vehicle.vehicle.label;

        if (label.length != 6 || label.slice(0, 2) != 'TR') return;
        buses[bus.id] = bus.vehicle;
      });

      // Fetch vehicle information
      fetch(API.VEHICLE_INFO + '?vehicleid=' + Object.keys(buses).join(','), {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': AT_AUTH_KEY
        }
      })
      .then(response => response.json())
      .then(data => data.response.entity)
      .then(rawBuses => {
        this.setState({ buses: [] });
        rawBuses.forEach(bus => {
          let vehicle = bus.trip_update;
          vehicle = {
            ...vehicle,
            ...buses[vehicle.vehicle.id]
          };
          vehicle.stops = {};

          this.setState({ buses: [...this.state.buses, vehicle] });
        });

        this.setState({ refreshing: false });
      }).catch(err => alert(`Error updating bus list: ${err.message}`));
    }).catch(err => alert(`Error updating bus list: ${err.message}`));
  }

  getMarkerColour(bus) {
    if (bus.occupancy_status < 1) return 'black';
    if (bus.occupancy_status < 2) return 'green';
    if (bus.occupancy_status < 3) return 'orange';

    return 'red';
  }

  renderBus(bus, i) {
    // Check for show state
    if (this.state.view != SHOW_ALL && (bus.trip == null || this.state.view != bus.trip.direction_id)) return null;
    if (bus.position == null) return null;
    if (bus.position.speed == null) bus.position.speed = 0;

    return (
      <Marker
        title={bus.vehicle.label}
        key={bus.vehicle.label}
        coordinate={{
          latitude: bus.position.latitude,
          longitude: bus.position.longitude
        }}
        pinColor={this.getMarkerColour(bus)}
      >
        <Callout
          onPress={this.updateBusInformation.bind(this, bus, i, this.handleCalloutPress.bind(this, i))}
        >
          <Text>{bus.vehicle.label}</Text>
        </Callout>
      </Marker>
    );
  }

  handleCalloutPress(i) {
    this.state.navigation.navigate('Info', { bus: this.state.buses[i], times: this.state.times });
  }

  updateBusInformation(bus, i, cb) {
    if (bus.trip == null || Object.keys(bus.stops).length != 0) {
      if (cb) cb(bus);
      return;   
    }

    fetch(API.TRIP_INFO + bus.trip.trip_id, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      this.state.buses[i] = {
        ...bus,
        ...data
      };

      this.forceUpdate();
      if (cb) cb(this.state.buses[i]);
    }).catch(err => alert(`Error updating bus information: ${e.message}`));
  }

  getViewValue() {
    switch (this.state.view) {
      case DIRECTION_CITY:
      return '->City';
      case DIRECTION_ALBANY:
      return '->Albany';
      case SHOW_ALL:
      return 'All';
    }
  }

  getTimesMode() {
    switch(this.state.times) {
      case SCHEDULED_TIMES:
      return 'Scheduled';
      case PREDICTED_TIMES:
      return 'Predicted';
    }
  }

  updateTime() {
    var hour, mins, secs, date;
    date = new Date();
  
    hour = date.getHours();
    mins = date.getMinutes();
    secs = date.getSeconds();
  
    if (mins < 10) {
      mins = '0' + mins;
    }
  
    if (secs < 10) {
      secs = '0' + secs;
    }
  
    this.setState({ time: hour + ':' + mins + ':' + secs});
  }

  render() {
    this.state.navigation.setOptions({
      headerLeft: () => (
        <Grid>
          <Col>
            <Button
              title={this.getViewValue()}
              onPress={() => {
                let newValue = this.state.view + 1;
                if (newValue > 2) newValue = 0;

                this.setState({ view: newValue });
              }}
            />
          </Col>
          <Col>
            <Button 
              title={this.getTimesMode()}
              onPress={() => {
                let newValue = this.state.times + 1;
                if (newValue > 1) newValue = 0;

                this.setState({ times: newValue });
              }}
            />
          </Col>
          <Col>
            {this.state.refreshing ? <ActivityIndicator size="large" color="#000000" /> : <Button title={'Refresh'} onPress={this.updateBusList.bind(this)} />}
          </Col>
          <Col><Button title={this.state.time} /></Col>
        </Grid>
      ),
      headerTitle: null
    });

    return (
      <View style={styles.container}>
        <MapView style={styles.map} initialRegion={this.state.region} >
          {this.state.buses.map(this.renderBus.bind(this))}
        </MapView>
      </View>
    );
  }
}

export default Map;