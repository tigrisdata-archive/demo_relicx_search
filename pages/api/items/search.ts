import { NextApiRequest, NextApiResponse } from 'next';
import { LogicalOperator, Order, SelectorFilterOperator } from '@tigrisdata/core';
import { SearchMeta, SearchQuery, SearchResult } from '@tigrisdata/core';
import searchClient from '../../../lib/tigris';
import { IndexedProperties, SessionV2, SESSIONV2_INDEX_NAME } from '../../../search/models/sessionv2';

type Data = {
  result?: SearchResult<Session> | SearchMeta;
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
            'indexed_properties.userId',
            'indexed_properties.userAgent',
            'indexed_properties.browser',
            'indexed_properties.language',
            'indexed_properties.platform',
            'indexed_properties.vendor',
            'indexed_properties.referrer',
            'indexed_properties.entryUrl',
            'indexed_properties.geoCoordinates.city',
            'indexed_properties.geoCoordinates.state',
            'indexed_properties.geoCoordinates.countryCode',
            'indexed_properties.geoCoordinates.countryName',
            'indexed_properties.geoCoordinates.IPv4',
            'indexed_properties.user_vars.user_id',
            'indexed_properties.user_vars.email',
            'indexed_properties.user_vars.tenant',
            'indexed_properties.labels',
            'indexed_properties.sessionType',
          ] /*
      facets: metaOnly
        ? undefined
        : [
            'record.geo_coordinates.city',
            'record.geo_coordinates.countryName',
            'record.browser',
            'record.device',
            'record.platform',
            'record.language',
            'record.entry_url',
            'record.user_vars.email',
            'record.user_vars.tenant',
          ],
      sort: [
        {
          field: 'indexed_properties.timestamp',
          order: order?.toString().toLowerCase() == 'asc' ? '$asc' : '$desc',
        },
      ], */,
      hitsPerPage: Number(size) || 10,
      filter:
        dateStart && dateEnd
          ? {
              /* op: LogicalOperator.AND,
              selectorFilters: [
                {
                  op: SelectorFilterOperator.GTE,
                  fields: {
                    created_at: new Date(dateStart.toString()),
                  },
                },
                {
                  op: SelectorFilterOperator.LTE,
                  fields: {
                    created_at: new Date(dateEnd.toString()),
                  },
                },
              ], */
            }
          : undefined,
    };

    index
      .search(request, Number(page) || 1)
      .then(results => {
        res.status(200).json({ result: metaOnly ? results.meta : results });
      })
      .catch(error => {
        throw error;
      });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}
