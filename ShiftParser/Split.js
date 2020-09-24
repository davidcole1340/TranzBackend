const { Trip } = require('./Trip.js');
const { Special } = require('./Special.js');
const { Break } = require('./Break.js');

class Split {
  constructor(sign_on, sign_off) {
    this.sign_on = sign_on;
    this.sign_off = sign_off;
    this.trips = [];
    this.specials = [];
    this.breaks = [];
  }

  setSignOn(sign_on) {
    this.sign_on = sign_on;
  }

  setSignOff(sign_off) {
    this.sign_off = sign_off;
  }

  addTrip(route, route_id, time) {
    let trip = new Trip(route, route_id, time);

    this.trips.push(trip);
  }
  
  addSpecial(destination, time) {
    let special = new Special(destination, time);

    this.specials.push(special);
  }

  addBreak(start, finish, paid) {
    let _break = new Break(start, finish, paid);

    this.breaks.push(_break);
  }
}

exports.Split = Split;