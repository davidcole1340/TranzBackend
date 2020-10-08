export type Shift = {
  _id: string,
  hours_worked: number,
  type: number,
  splits: Split[]
}

export type Split = {
  _id: string,
  sign_on: string,
  sign_off: string,
  shift_id: string,
  shift: Shift,
  trips: Trip[],
  breaks: Break[]
}

export type Trip = {
  _id: string,
  split_id: string,
  destination: string,
  route: string,
  route_id: string,
  time: string,
  split: Split
}

export type Break = {
  _id: string,
  split_id: string,
  start: string,
  finish: string,
  paid: boolean,
  split: Split
}