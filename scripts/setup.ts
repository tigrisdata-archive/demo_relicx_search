import { Tigris } from '@tigrisdata/core';
import { SessionV3 } from '../search/models/sessionv3';

async function main() {
  // setup client
  const tigrisClient = new Tigris();

  // register index definitions
  const search = tigrisClient.getSearch();
  await search.createOrUpdateIndex(SessionV3);
}

main()
  .then(async () => {
    console.log('Setup complete ...');
    process.exit(0);
  })
  .catch(async e => {
    console.error(e);
    process.exit(1);
  });
