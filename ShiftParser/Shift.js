class Shift {
  constructor(shift_number, hours_worked) {
    this.shift_number = shift_number;
    this.hours_worked = hours_worked;
    this.splits = [];
  }

  setShiftNumber(shift_number) {
    this.shift_number = shift_number;
  }

  setHoursWorked(hours_worked) {
    this.hours_worked = hours_worked;
  }

  addSplit(split) {
    this.splits.push(split);
  }
}

exports.Shift = Shift;