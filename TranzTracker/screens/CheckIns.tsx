import React, { Context } from 'react';
import { CheckIn } from '../helpers/CheckInStorage';
import * as Storage from '../helpers/CheckInStorage';
import { Alert, Button, RefreshControl, SectionList, Text, View } from 'react-native';
import { Page, List as ListStyle } from '../styles';
import * as _ from 'underscore'
import moment from 'moment';
import { BusListContext } from '../context/BusListContext';
import { getBusColor, getBusDirection } from '../helpers';

type CheckInsProps = {}
type CheckInsState = {
  loading: boolean,
  checkIns: CheckIn[]
}

export class CheckIns extends React.Component<CheckInsProps, CheckInsState> {
  static contextType = BusListContext
  context!: React.ContextType<typeof BusListContext>

  state: CheckInsState = {
    loading: false,
    checkIns: []
  }

  componentDidMount() {
    this.updateCheckIns();
  }

  updateCheckIns() {
    this.setState({ loading: true })
    Storage.getCheckIns()
    .then(checkIns => this.setState({ checkIns: checkIns, loading: false }))
    .then(this.getSections.bind(this));
  }

  getSections() {
    const sections = [];
    const grouped = Object.entries(_.groupBy(this.state.checkIns, (check) => {
      return moment(check.time).startOf('day').format();
    })).sort(([adate, a], [bdate, b]) => moment(adate).isBefore(moment(bdate)) ? 1 : -1);

    for (const [date, checkIns] of grouped) {
      sections.push({
        title: moment(date).calendar().split(" ")[0],
        data: checkIns.sort((a, b) => a.time.isBefore(b.time) ? 1 : -1)
      });
    }

    return sections;
  }

  renderItem({ item }: { item: CheckIn }) {
    return (
      <View style={{ ...ListStyle.item, borderColor: getBusColor(item.bus, 'white')}}>
        <View style={{ ...ListStyle.row }}>
          <Text style={{...ListStyle.title, flex: 1 }}>{item.bus.vehicle.label}</Text>
          <Text style={{ ...ListStyle.title, flex: 1, textAlign: 'right' }}>{item.time.calendar()}</Text>
        </View>
        <View style={{ ...ListStyle.row }}>
          <Text style={ListStyle.text}>{this.context.stops.find(stop => stop._id == item.bus.stop_time_update.stop_id)?.stop_name}</Text>
          <Text style={{ ...ListStyle.text, textAlign: 'right' }}>{getBusDirection(item.bus)}</Text>
        </View>
      </View>
    )
  }

  handleClearCheckIns() {
    Alert.alert('Clear Check-ins', 'Are you sure you want to clear check-ins?', [
      {
        text: 'Yes',
        onPress: () => Storage.clearCheckIns().then(this.updateCheckIns.bind(this))
      },
      {
        text: 'Cancel',
        onPress: () => null
      }
    ]);
  }

  render() {
    return (
      <View style={Page.container}>
        <View>
          <View style={{ borderRadius: 20, backgroundColor: '#007AFF' }}>
            <Button
              title="Clear Check-ins"
              color="black"
              onPress={this.handleClearCheckIns.bind(this)}
            />
          </View>
        </View>
        <View style={Page.container}>
          <SectionList
            sections={this.getSections()}
            style={{ ...ListStyle.container }}
            renderSectionHeader={(info) => (
              <View style={{ ...ListStyle.item, ...ListStyle.headerContainer }}>
                <Text style={{ ...ListStyle.title, ...ListStyle.headerTitle }}>{info.section.title}</Text>
              </View>
            )}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={(item) => `${item.bus.vehicle.label}:${item.time}`}
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={this.updateCheckIns.bind(this)}
              />
            }
          />
        </View>
      </View> 
    );
  }
}