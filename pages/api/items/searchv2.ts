import { NextApiRequest, NextApiResponse } from 'next';
import { LogicalOperator, SelectorFilterOperator } from '@tigrisdata/core';
import { SearchQuery, SearchResult } from '@tigrisdata/core';
import searchClient from '../../../lib/tigris';
import { SessionV3, SESSIONV3_INDEX_NAME } from '../../../search/models/sessionv3';

type Data = {
  result?: SearchResult<SessionV3>;
  error?: string;
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
//     "field": "indexed_properties.geoCoordinates.countryName",
//     "operator": "eq",
//     "value": "United States"
//   },
//   {
//     "field": "indexed_properties.geoCoordinates.countryName",
//     "operator": "eq",
//     "value": "Canada"
//   }
// ],
//   "page": 1,
//   "size": 10,
//   "order": "desc",
//   "dateStart": "2023-02-10T00:00:00.000Z",
//   "dateEnd": "2023-02-13T00:00:00.000Z",
// }
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { q, searchFields, filters, page, size, order, dateStart, dateEnd } = req.body;

  try {
    const index = await searchClient.getIndex<SessionV3>(SESSIONV3_INDEX_NAME);

    const request: SearchQuery<SessionV3> = {
      q: q ? (q as string) : '*',
      searchFields: searchFields ?? [
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
          order: order?.toString().toLowerCase() == 'asc' ? '$asc' : '$desc',
        },
      ],
      hitsPerPage: Number(size) || 10,
      filter:
        dateStart && dateEnd
          ? {
              op: LogicalOperator.AND,
              selectorFilters: [
                {
                  op: SelectorFilterOperator.GTE,
                  fields: {
                    indexed_properties: {
                      timestamp: Date.parse(dateStart as string) * 1000,
                    },
                  },
                },
                {
                  op: SelectorFilterOperator.LTE,
                  fields: {
                    indexed_properties: {
                      timestamp: Date.parse(dateEnd as string) * 1000,
                    },
                  },
                },
              ],
            }
          : undefined,
    };

    index
      .search(request, Number(page) || 1)
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
