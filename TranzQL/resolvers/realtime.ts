import bent from 'bent'

const { AT_API_KEY } = process.env;

interface APIResponse<T> {
  status: string,
  response: {
    header: {
      timestamp: string,
      gtfs_realtime_version: string,
      incrementality: number
    },
    entity: Array<T>,
    error?: string
  }
}

interface TripUpdate {
  id: string,
  trip_update: TripUpdate_Update,
  is_deleted: boolean
}

interface TripUpdate_Update {
  trip: Trip,
  stop_time_update: StopTimeUpdate,
  vehicle: Vehicle,
  timestamp: number,
  delay: number
}

interface VehiclePosition {
  id: string,
  vehicle: VehiclePosition_Vehicle,
  is_deleted: boolean
}

interface VehiclePosition_Vehicle {
  trip: Trip,
  position: Position,
  timestamp: number,
  vehicle: Vehicle,
  occupancy_status: number
}

interface Trip {
  trip_id: string,
  start_time: string,
  start_date: string,
  schedule_relationship: number,
  route_id: string,
  direction_id: number
}

interface StopTimeUpdate {
  stop_sequence: number,
  arrival: {
    delay: number,
    time: number,
    uncertainty: number
  },
  stop_id: string,
  schedule_relationship: number
}

interface Vehicle {
  id: string,
  label: string,
  license_plate: string
}

interface Position {
  latitude: number,
  longitude: number,
  bearing: number,
  odometer: number,
  speed: number
}

interface BusData extends TripUpdate_Update, VehiclePosition_Vehicle {}

const busIds: string = (() => {
  let i: number;
  const busIds: number[] = [];
  
  // Scania IDs
  for (i = 31340; i < 31360; i++) {
    busIds.push(i);
  }
  
  // BCI IDs
  for (i = 31550; i < 31570; i++) {
    busIds.push(i);
  }

  return busIds.join(',');
})()

const atClient = bent(`https://api.at.govt.nz/v2/public/realtime/`, 'GET', 'json', { 'Ocp-Apim-Subscription-Key': AT_API_KEY });

export const getBusData = async (): Promise<BusData[]> => {
  let response: Array<BusData> = [];

  const [tripUpdates, positionUpdates] = await Promise.all<APIResponse<TripUpdate>, APIResponse<VehiclePosition>>([
    atClient(`tripupdates?vehicleid=${busIds}`) as Promise<APIResponse<TripUpdate>>,
    atClient(`vehiclelocations?vehicleid=${busIds}`) as Promise<APIResponse<VehiclePosition>>
  ]);

  if (tripUpdates.status !== 'OK') {
    throw new Error(tripUpdates.response.error);
  }

  if (positionUpdates.status !== 'OK') {
    throw new Error(positionUpdates.response.error);
  }

  positionUpdates.response.entity.forEach(pos => {
    const update = tripUpdates.response.entity.find(u => pos.vehicle.vehicle.id == u.trip_update.vehicle.id)

    if (update !== undefined) {
      const data: BusData = {
        ...pos.vehicle,
        ...update.trip_update
      }

      response.push(data)
    }
  })

  return response;
}