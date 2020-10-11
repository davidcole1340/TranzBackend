export * from './functions'
export * from './location'

export const OCCUPANCY_STRINGS: {[key: string]: string} = {
  0: 'No passengers',
  1: 'Many seats available',
  2: 'Few seats available',
  3: 'Standing room only',
  4: 'Minimal standing room only',
  5: 'Bus full',
  6: 'Bus not accepting passengers'
};