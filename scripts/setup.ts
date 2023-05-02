import { Tigris } from '@tigrisdata/core';
import { SessionV4 } from '../search/models/sessionv4';

async function main() {
  // setup client
  const tigrisClient = new Tigris();

  // register index definitions
  const search = tigrisClient.getSearch();
  await search.createOrUpdateIndex(SessionV4);
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
