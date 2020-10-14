const {
  AT_API_KEY,
  MONGO_HOST,
  MONGO_GTFS_DB
} = process.env;

import bent from 'bent';
import * as Process from 'child_process'
import { Db } from 'mongodb';

const getVersions = bent('https://api.at.govt.nz/v2/gtfs/versions', 'GET', { 'Ocp-Apim-Subscription-Key': AT_API_KEY }, 'json');

type VersionType = {
  status: string;
  response: {
    version: string,
    startdate: string,
    enddate: string
  }[];
  error?: string;
}

export async function checkVersions(db: Db) {
  const data: VersionType = (await getVersions('')) as VersionType;

  if (data.status != 'OK') throw new Error(data.error);
  const versions = data.response.map(version => version.version);
  
  for (const version of versions) {
    const count = await db.collection('routes').find({
      _id: new RegExp(version)
    }).count()

    if (count < 1) {
      console.log(`Version ${version} missing, running update script.`);
      const dir = process.cwd();

      const updater = Process.spawn(`${dir}/gtfsimport`, [ MONGO_HOST as string, MONGO_GTFS_DB as string ]);
      updater.stdout.on('data', (data) => process.stdout.write(`script: ${data}`));
      updater.stderr.on('data', (data) => process.stderr.write(`script: ${data}`));

      const closeCode = await new Promise(resolve => updater.on('close', resolve));
      console.log(`update closed with code ${closeCode}`);

      break;
    }
  }
}