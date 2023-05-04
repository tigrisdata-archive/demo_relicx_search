import { Tigris } from '@tigrisdata/core';
import { SessionV4, SESSIONV4_INDEX_NAME } from '../search/models/sessionv4';

async function main() {
  // setup client
  const tigrisClient = new Tigris();

  // register index definitions
  const search = tigrisClient.getSearch();
  await search.createOrUpdateIndexFromClass(SessionV4, SESSIONV4_INDEX_NAME);
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
