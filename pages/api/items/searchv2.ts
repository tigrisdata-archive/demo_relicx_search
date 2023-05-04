import { NextApiRequest, NextApiResponse } from 'next';
import { Filter, LogicalOperator, SelectorFilterOperator } from '@tigrisdata/core';
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
    field: string;
    operator: string;
    value: string | number | boolean;
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
  const body = JSON.parse(req.body) as BodySchema;

  try {
    const index = await searchClient.getIndex<SessionV4>(SESSIONV4_INDEX_NAME);

    if (body.dateStart) {
      body.filters?.push({
        field: 'indexed_properties.timestamp',
        operator: SelectorFilterOperator.GTE,
        value: Date.parse(body.dateStart as string) * 1000,
      });
    }
    if (body.dateEnd) {
      body.filters?.push({
        field: 'indexed_properties.timestamp',
        operator: SelectorFilterOperator.LTE,
        value: Date.parse(body.dateEnd as string) * 1000,
      });
    }

    const selectorFilters = body.filters?.map(filter => {
      if (filter.field == 'commands') {
        filter.field = 'commands.params';
      }

      return {
        op: filter.operator as SelectorFilterOperator,
        fields: {
          [filter.field]: filter.value,
        },
      };
    });

    let filters: Filter<SessionV4> = {};
    if (selectorFilters && selectorFilters.length > 0) {
      if (selectorFilters.length === 1) {
        filters = selectorFilters[0].fields;
      } else {
        filters = {
          op: LogicalOperator.AND,
          selectorFilters: selectorFilters,
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
        'issues.relicx_type',
        'issues.message',
        'issues.source',
        'issues.severity',
        'issues.urlParameterized',
        'issues.stackTrace',
        'resources.method',
        'resources.url'
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
