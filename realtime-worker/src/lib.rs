extern crate console_error_panic_hook;
extern crate wasm_bindgen;

pub use self::console_error_panic_hook::set_once as set_panic_hook;

use at_api_rs::{
    types::gtfs::{
        OccupancyStatus, Position, StopTimeUpdate, TripDescriptor, TripUpdate, VehicleDescriptor,
        VehiclePosition,
    },
    Realtime,
};
use serde::Serialize;
use wasm_bindgen::prelude::*;

#[derive(Serialize)]
struct Response {
    ok: bool,
    error: Option<String>,
    vehicles: Option<Vec<ResponseEntity>>,
}

#[derive(Serialize)]
struct ResponseEntity {
    trip: Option<TripDescriptor>,
    stop_time_update: Option<StopTimeUpdate>,
    vehicle: Option<VehicleDescriptor>,
    timestamp: Option<u64>,
    delay: Option<i32>,

    position: Option<Position>,
    occupancy_status: Option<OccupancyStatus>,
}

impl ResponseEntity {
    pub fn new(vehicle: VehiclePosition, trip_update: Option<TripUpdate>) -> Self {
        if let Some(trip_update) = trip_update {
            Self {
                trip: Some(trip_update.trip),
                stop_time_update: trip_update.stop_time_update,
                vehicle: trip_update.vehicle,
                timestamp: trip_update.timestamp,
                delay: trip_update.delay,
                position: vehicle.position,
                occupancy_status: vehicle.occupancy_status,
            }
        } else {
            Self {
                trip: vehicle.trip,
                stop_time_update: None,
                vehicle: None,
                timestamp: None,
                delay: None,
                position: vehicle.position,
                occupancy_status: vehicle.occupancy_status,
            }
        }
    }
}

#[wasm_bindgen]
pub async fn fetch_vehicles(api_key: String) -> String {
    set_panic_hook();

    let bus_ids: Vec<String> = (31340..31360)
        .chain(31550..31570)
        .map(|e| e.to_string())
        .collect();
    let ref_ids = bus_ids.iter().map(|i| i.as_str()).collect::<Vec<_>>();

    let rt = Realtime::new(&api_key);

    let response = match rt.fetch_combined(None, Some(&ref_ids)).await {
        Ok((_, vehicles)) => Response {
            ok: true,
            error: None,
            vehicles: Some(
                vehicles
                    .into_iter()
                    .map(|e| ResponseEntity::new(e.vehicle.unwrap(), e.trip_update))
                    .collect(),
            ),
        },
        Err(e) => Response {
            ok: false,
            error: Some(format!("Unable to fetch vehicles from AT: {:?}", e)),
            vehicles: None,
        },
    };

    serde_json::to_string(&response).unwrap()
}
