addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleRequest(request) {
  const { fetch_vehicles } = wasm_bindgen;
  await wasm_bindgen(wasm)
  const vehicles = await fetch_vehicles(AT_API_KEY)
  return new Response(vehicles, { status: 200, headers: {
    'Content-Type': 'application/json'
  } })
}
