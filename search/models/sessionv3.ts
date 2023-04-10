import { SearchField, TigrisDataTypes, TigrisSearchIndex } from '@tigrisdata/core';

export const SESSIONV3_INDEX_NAME = 'sessionv3';

export class GeoCoordinates {
  @SearchField()
  countryCode?: string;

  @SearchField({ facet: true })
  countryName?: string;

  @SearchField({ facet: true })
  city?: string;

  @SearchField()
  postal?: string;

  @SearchField()
  latitude?: string;

  @SearchField()
  longitude?: string;

  @SearchField()
  IPv4?: string;

  @SearchField({ facet: true })
  state?: string;
}

export class UserVars {
  @SearchField()
  user_id?: string;

  @SearchField({ facet: true })
  email?: string;

  @SearchField({ facet: true })
  tenant?: string;
}

export class IndexedProperties {
  @SearchField(TigrisDataTypes.INT64, { sort: true })
  timestamp?: number;

  @SearchField()
  hostname?: string;

  @SearchField()
  origin?: string;

  @SearchField()
  sessionId?: string;

  @SearchField()
  userId?: string;

  @SearchField()
  userAgent?: string;

  @SearchField({ facet: true })
  browser?: string;

  @SearchField({ facet: true })
  language?: string;

  @SearchField({ facet: true })
  platform?: string;

  @SearchField({ facet: true })
  vendor?: string;

  @SearchField()
  referrer?: string;

  @SearchField({ facet: true })
  entryUrl?: string;

  @SearchField()
  orgId?: string;

  @SearchField()
  appId?: string;

  @SearchField(TigrisDataTypes.INT64, { sort: true })
  sessionStartTime?: string;

  @SearchField(TigrisDataTypes.INT64, { sort: true })
  lastEventTime?: string;

  @SearchField()
  geoCoordinates?: GeoCoordinates;

  @SearchField()
  userVars?: UserVars;

  @SearchField({ elements: TigrisDataTypes.STRING, facet: true })
  labels?: string[];

  @SearchField()
  sessionType?: string;

  @SearchField(TigrisDataTypes.INT64, { facet: true, sort: true })
  activeDuration?: string;

  @SearchField(TigrisDataTypes.INT64, { facet: true, sort: true })
  sessionDuration?: string;

  @SearchField(TigrisDataTypes.INT64, { facet: true, sort: true })
  errors?: string;
}

export class Command {
  @SearchField()
  command?: string;

  @SearchField({ elements: TigrisDataTypes.STRING })
  params?: string[];
}

@TigrisSearchIndex(SESSIONV3_INDEX_NAME)
export class SessionV3 {
  @SearchField()
  indexed_properties?: IndexedProperties;

  @SearchField({ elements: Command })
  commands?: Command[];
}
