import { SearchField, TigrisDataTypes, TigrisSearchIndex } from '@tigrisdata/core';

export const SESSION_INDEX_NAME = 'session';

export class GeoCoordinates {
  @SearchField({ facet: true })
  city?: string;

  @SearchField({ facet: true })
  state?: string;

  @SearchField({ facet: true })
  countryCode?: string;

  @SearchField({ facet: true })
  countryName?: string;

  @SearchField()
  IPv4?: string;

  @SearchField(TigrisDataTypes.NUMBER)
  longitude?: string;

  @SearchField(TigrisDataTypes.NUMBER)
  latitude?: string;
}

export class UserVars {
  @SearchField(TigrisDataTypes.UUID)
  user_id?: string;

  @SearchField({ facet: true })
  email?: string;

  @SearchField({ facet: true })
  tenant?: string;
}

export class Record {
  @SearchField(TigrisDataTypes.UUID)
  app_id?: string;

  @SearchField(TigrisDataTypes.UUID)
  org_id?: string;

  @SearchField(TigrisDataTypes.UUID)
  session_id?: string;

  @SearchField(TigrisDataTypes.UUID)
  user_id?: string;

  @SearchField({ facet: true })
  browser?: string;

  @SearchField()
  geo_coordinates?: GeoCoordinates;

  @SearchField({ facet: true })
  device?: string;

  @SearchField({ facet: true })
  entry_url?: string;

  @SearchField()
  hostname?: string;

  @SearchField({ elements: TigrisDataTypes.STRING })
  labels?: string[];

  @SearchField({ facet: true })
  platform?: string;

  @SearchField()
  user_vars?: UserVars;

  @SearchField({ facet: true })
  language?: string;

  @SearchField()
  capturedSessionState?: string;

  @SearchField({ facet: true })
  vendor?: string;

  @SearchField(TigrisDataTypes.INT64, { sort: true })
  timestamp?: string;
}

@TigrisSearchIndex(SESSION_INDEX_NAME)
export class Session {
  @SearchField({ sort: true })
  created_at?: Date;

  @SearchField({ sort: true })
  updated_at?: Date;

  @SearchField()
  record?: Record;
}
