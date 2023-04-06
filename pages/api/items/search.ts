import { NextApiRequest, NextApiResponse } from 'next';
import { LogicalOperator, SelectorFilterOperator } from '@tigrisdata/core';
import { SearchMeta, SearchQuery, SearchResult } from '@tigrisdata/core';
import searchClient from '../../../lib/tigris';
import { SessionV2, SESSIONV2_INDEX_NAME } from '../../../search/models/sessionv2';
import JSONBig from 'json-bigint';

type Data = {
  result?: SearchResult<SessionV2> | SearchMeta;
  error?: string;
};

// GET /api/items/search?q=searchQ&page=1&size=10&order=desc&dateStart=2023-02-10T00:00:00.000Z&dateEnd=2023-02-13T00:00:00.000Z -- searches for items matching text `searchQ`
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { q, page, size, order, dateStart, dateEnd, metaOnly, searchFields } = req.query;

  if (q === undefined) {
    res.status(400).json({ error: 'No search query found in request' });
    return;
  }
  try {
    const index = await searchClient.getIndex<SessionV2>(SESSIONV2_INDEX_NAME);

    const request: SearchQuery<SessionV2> = {
      q: q as string,
      searchFields: searchFields
        ? (searchFields as string).split(',')
        : [
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
          ],
      facets: metaOnly
        ? undefined
        : [
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
                      timestamp: Date.parse(dateStart as string).toString(),
                    },
                  },
                },
                {
                  op: SelectorFilterOperator.LTE,
                  fields: {
                    indexed_properties: {
                      timestamp: Date.parse(dateEnd as string).toString(),
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
        res
          .status(200)
          .setHeader('Content-Type', 'application/json; charset=utf-8')
          .send({ result: metaOnly ? results.meta : results });
      })
      .catch(error => {
        throw error;
      });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}
