import { Search, Tigris } from "@tigrisdata/core";

const tigrisClient = new Tigris();
const searchClient: Search = tigrisClient.getSearch();

// export to share DB across modules
export default searchClient;
