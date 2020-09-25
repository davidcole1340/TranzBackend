const {
  MONGO_HOST,
  MONGO_GTFS_DB,
  AT_API_KEY
} = process.env;

if (! MONGO_HOST || ! MONGO_GTFS_DB || ! AT_API_KEY) {
  console.error(`env variables are not set: MONGO_HOST=${MONGO_HOST}, MONGO_GTFS_DB=${MONGO_GTFS_DB}, AT_API_KEY=${AT_API_KEY}`);
  return process.exit(1);
}

const delay = 1000 * 60 * 60 * 12; // 12 hours
const url = `mongodb://${MONGO_HOST}:27017`;

console.log(`MONGO_HOST=${MONGO_HOST}, MONGO_GTFS_DB=${MONGO_GTFS_DB}, AT_API_KEY=${AT_API_KEY}`);
console.log(url);

const MongoClient = require('mongodb').MongoClient;
const getVersions = require('bent')('https://api.at.govt.nz/v2/gtfs/versions', 'GET', 'json', { 'Ocp-Apim-Subscription-Key': AT_API_KEY });
const { spawn } = require('child_process');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  while (true) {
    await checkVersion();
    await sleep(delay);
  }
}

async function checkVersion() {
  const data = await getVersions();
  if (data.status != 'OK') throw new Error(data.error);
  const versions = data.response.map(version => version.version);

  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db(MONGO_GTFS_DB);
  
  for (const version of versions) {
    const count = await db.collection('routes').find({
      _id: new RegExp(version)
    }).count()

    if (count < 1) {
      console.log(`Version ${version} missing, running update script.`);
      
      const updater = spawn(`./gtfsimport`, [ MONGO_HOST, MONGO_GTFS_DB ]);
      updater.stdout.on('data', (data) => process.stdout.write(`script: ${data}`));
      updater.stderr.on('data', (data) => process.stderr.write(`script: ${data}`));

      const closeCode = await new Promise(resolve => updater.on('close', resolve));
      console.log(`update closed with code ${closeCode}`);

      break;
    }
  }
}

run().then(console.log).catch(console.error);