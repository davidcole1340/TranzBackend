const { PdfReader, Rule } = require('pdfreader');
const { Shift } = require('./Shift.js');
const { Split } = require('./Split.js');
const mysql = require('mysql');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json'));
const con = mysql.createConnection(config);

let shifts = [];
let shift;
let split;
let nextCallback;
let nextCount;

const fileName = 'schoolhol.pdf';
const shiftType = 2;

const getNextValue = (callback, n) => {
  nextCount = n ? n : 1;
  nextCallback = callback;
};

const cases = [
  {
    regex: /SHIFT (.*)/,
    callback: result => {
      shift.setShiftNumber(result[1]);
    }
  },
  {
    regex: /HOURS\s*WORKED\s*:\s*([^\s]*)/,
    callback: result => {
      shift.setHoursWorked(parseFloat(result[1]));
    }
  },
  {
    regex: /Sign On/,
    callback: () => {
      split = new Split();

      getNextValue(result => {
        split.setSignOn(result);
      })
    }
  },
  {
    regex: /Depot Finish/,
    callback: () => {
      getNextValue(result => {
        split.setSignOff(result);

        shift.addSplit(split);
        split = new Split();
      })
    }
  },
  {
    regex: /([0-9]{4}) Special To (.*)/,
    callback: result => {
      split.addSpecial(result[2], result[1]);
    }
  },
  {
    regex: /Route: (.*) - V:([0-9 ]*) - D:.*- Trip:([0-9]{4}) - D:([0-9]{4})/,
    callback: result => {
      getNextValue(next => {
        if (next != result[3]) return;

        split.addTrip(result[1], result[2], result[3]);
      }, 2);
    }
  },
  {
    regex: /PAID REST BREAK from ([0-9]*) to ([0-9]*)/,
    callback: result => {
      split.addBreak(result[1], result[2], true);
    }
  },
  {
    regex: /MEAL from ([0-9]*) to ([0-9]*)/,
    callback: result => {
      split.addBreak(result[1], result[2], false); 
    }
  }
];

new PdfReader().parseFileItems(fileName, (err, item) => {
  if (! item) {
    shifts.push(shift);
    console.log(shifts);

    con.connect(err => {
      if (err) throw err;

      shifts.forEach(shift => {
        con.query(`INSERT INTO \`shifts\` (shift_id, hours_worked, type) VALUES ('${shift.shift_number}', '${shift.hours_worked}', ${shiftType})`, (e1, r1) => {
          if (e1) throw e1;

          shift.splits.forEach(split => {
            con.query(`INSERT INTO \`splits\` (shift_id, sign_on, sign_off) VALUES ('${shift.shift_number}', '${split.sign_on}00', '${split.sign_off}00')`, (e2, r2) => {
              if (e2) throw e2;

              split.trips.forEach(trip => {
                con.query(`INSERT INTO \`trips\` (split_id, route, route_id, time) VALUES (${r2.insertId}, '${trip.route}', '${trip.route_id}', '${trip.time}00')`, (e3, r3) => {
                  if (e3) throw e3;
                });
              });

              split.specials.forEach(special => {
                con.query(`INSERT INTO \`trips\` (split_id, destination, time) VALUES (${r2.insertId}, '${special.destination}', '${special.time}00')`, (e3, r3) => {
                  if (e3) throw e3;
                });
              });

              split.breaks.forEach(_break => {
                con.query(`INSERT INTO \`breaks\` (split_id, start, finish, paid) VALUES (${r2.insertId}, '${_break.start}00', '${_break.finish}00', ${_break.paid ? 1 : 0})`), (e3, r3) => {
                  if (e3) throw e3;
                };
              });
            });
          });
        })
      });
    });

    return;
  }

  if (item.page) {
    if (shift) {
      shifts.push(shift);
    }
    
    console.log(`Page: ${item.page}`);
    shift = new Shift();
  }

  if (item.text) {

    if (nextCallback) {
      if (--nextCount == 0) {
        nextCallback(item.text);
        nextCallback = null;
      }
    }

    cases.forEach(matcher => {
      let result = matcher.regex.exec(item.text);

      if (result) {
        matcher.callback(result);
      }
    });
  }
});