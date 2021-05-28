extern crate console_error_panic_hook;
extern crate wasm_bindgen;

pub use self::console_error_panic_hook::set_once as set_panic_hook;

use at_api_rs::{types::gtfs::Entity, Realtime};
use serde::Serialize;
use wasm_bindgen::prelude::*;

#[derive(Serialize)]
struct Response {
    ok: bool,
    error: Option<String>,
    vehicles: Option<Vec<Entity>>,
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
            vehicles: Some(vehicles),
        },
        Err(e) => Response {
            ok: false,
            error: Some(format!("Unable to fetch vehicles from AT: {:?}", e)),
            vehicles: None,
        },
    };

    serde_json::to_string(&response).unwrap()
}
