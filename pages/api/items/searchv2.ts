import { NextApiRequest, NextApiResponse } from 'next';
import { Filter } from '@tigrisdata/core';
import { SearchQuery, SearchResult } from '@tigrisdata/core';
import searchClient from '../../../lib/tigris';
import { SessionV4, SESSIONV4_INDEX_NAME } from '../../../search/models/sessionv4';

type Data = {
  result?: SearchResult<SessionV4>;
  error?: string;
};

type BodySchema = {
  q?: string;
  searchFields?: string[];
  filters?: {
    [x: string]: { [x: string]: string | number | boolean };
  }[];
  page?: number;
  size?: number;
  order?: string;
  dateStart?: string;
  dateEnd?: string;
};

// POST /api/items/search -- searches for items matching text `searchQ`
// {
//   "q": "searchQ",
//   "searchFields": [
//     "indexed_properties.hostname",
//     "indexed_properties.origin",
//     "indexed_properties.sessionId",
//     "indexed_properties.userId",
//    ],
// "filters": [
//   {
//     "indexed_properties.geoCoordinates.countryName": {"$eq": "United States"}
//   },
//   {
//     "indexed_properties.geoCoordinates.countryName": {"$eq": "Canada"}
//   }
// ],
//   "page": 1,
//   "size": 10,
//   "order": "desc",
//   "dateStart": "2023-02-10T00:00:00.000Z",
//   "dateEnd": "2023-02-13T00:00:00.000Z",
// }
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const body = JSON.parse(req.body) as BodySchema;

  try {
    const index = await searchClient.getIndex<SessionV4>(SESSIONV4_INDEX_NAME);

    if (body.dateStart) {
      body.filters?.push({
        'indexed_properties.timestamp': {
          $gte: Date.parse(body.dateStart as string) * 1000,
        },
      });
    }
    if (body.dateEnd) {
      body.filters?.push({
        'indexed_properties.timestamp': {
          $lte: Date.parse(body.dateEnd as string) * 1000,
        },
      });
    }

    let filters: Filter<SessionV4> = {};
    if (body.filters && body.filters.length > 0) {
      if (body.filters.length === 1) {
        filters = body.filters[0];
      } else {
        filters = {
          $and: body.filters,
        };
      }
    }

    const request: SearchQuery<SessionV4> = {
      q: body.q ?? '*',
      searchFields: body.searchFields ?? [
        'indexed_properties.hostname',
        'indexed_properties.origin',
        'indexed_properties.sessionId',
        'indexed_properties.userId',
        'indexed_properties.userAgent',
        'indexed_properties.browser',
        'indexed_properties.language',
        'indexed_properties.platform',
        'indexed_properties.vendor',
        'indexed_properties.referrer',
        'indexed_properties.entryUrl',
        'indexed_properties.orgId',
        'indexed_properties.appId',
        'indexed_properties.geoCoordinates.city',
        'indexed_properties.geoCoordinates.state',
        'indexed_properties.geoCoordinates.countryCode',
        'indexed_properties.geoCoordinates.countryName',
        'indexed_properties.geoCoordinates.IPv4',
        'indexed_properties.userVars.user_id',
        'indexed_properties.userVars.email',
        'indexed_properties.userVars.tenant',
        'indexed_properties.labels',
        'indexed_properties.sessionType',
        'commands',
        'issues',
        'resources',
      ],
      facets: [
        'indexed_properties.geoCoordinates.city',
        'indexed_properties.geoCoordinates.countryName',
        'indexed_properties.browser',
        'indexed_properties.language',
        'indexed_properties.platform',
        'indexed_properties.vendor',
        'indexed_properties.entryUrl',
        'indexed_properties.labels',
        'indexed_properties.userVars.email',
        'indexed_properties.userVars.tenant',
      ],
      sort: [
        {
          field: 'indexed_properties.timestamp',
          order: body.order?.toString().toLowerCase() == 'asc' ? '$asc' : '$desc',
        },
      ],
      hitsPerPage: Number(body.size) || 10,
      filter: filters,
    };

    index
      .search(request, Number(body.page) || 1)
      .then(results => {
        res.status(200).json({ result: results });
      })
      .catch(error => {
        throw error;
      });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}
