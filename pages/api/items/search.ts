import { NextApiRequest, NextApiResponse } from 'next';
import { LogicalOperator, Order, SelectorFilterOperator } from '@tigrisdata/core';
import { SearchQuery, SearchResult } from '@tigrisdata/core/dist/search';
import searchClient from '../../../lib/tigris';
import { Session, SESSION_INDEX_NAME } from '../../../search/models/session';

type Data = {
  result?: SearchResult<Session>;
  error?: string;
};

// GET /api/items/search?q=searchQ&page=1&size=10&order=desc&dateStart=2023-02-10T00:00:00.000Z&dateEnd=2023-02-13T00:00:00.000Z -- searches for items matching text `searchQ`
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { q, page, size, order, dateStart, dateEnd } = req.query;

  if (q === undefined) {
    res.status(400).json({ error: 'No search query found in request' });
    return;
  }
  try {
    const index = await searchClient.getIndex<Session>(SESSION_INDEX_NAME);

    const request: SearchQuery<Session> = {
      q: q as string,
      searchFields: [
        'record.app_id',
        'record.org_id',
        'record.session_id',
        'record.user_id',
        'record.browser',
        'record.geo_coordinates.city',
        'record.geo_coordinates.state',
        'record.geo_coordinates.countryCode',
        'record.geo_coordinates.countryName',
        'record.geo_coordinates.IPv4',
        'record.device',
        'record.entry_url',
        'record.hostname',
        'record.labels',
        'record.platform',
        'record.language',
        'record.capturedSessionState',
        'record.vendor',
      ],
      facets: [
        'record.geo_coordinates.city',
        'record.geo_coordinates.state',
        'record.geo_coordinates.countryCode',
        'record.geo_coordinates.countryName',
        'record.browser',
        'record.device',
        'record.platform',
        'record.language',
        'record.vendor',
      ],
      sort: [
        {
          field: 'created_at',
          order: order?.toString().toLowerCase() == 'asc' ? Order.ASC : Order.DESC,
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
                    created_at: new Date(dateStart.toString()),
                  },
                },
                {
                  op: SelectorFilterOperator.LTE,
                  fields: {
                    created_at: new Date(dateEnd.toString()),
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
