import { NextApiRequest, NextApiResponse } from 'next';
import { SearchMeta, SearchQuery } from '@tigrisdata/core';
import searchClient from '../../../lib/tigris';
import { SessionV4, SESSIONV4_INDEX_NAME } from '../../../search/models/sessionv4';

type Data = {
  result?: SearchMeta;
  error?: string;
};

// GET /api/items/search-meta?q=searchQ -- find all fields that match the text `searchQ`
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { q } = req.query;

  if (q === undefined) {
    res.status(400).json({ error: 'No search query found in request' });
    return;
  }
  try {
    const index = await searchClient.getIndex<SessionV4>(SESSIONV4_INDEX_NAME);

    const request: SearchQuery<SessionV4> = {
      q: q as string,
      searchFields: [
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
        'resources'
      ],
      hitsPerPage: 10,
    };

    index
      .search(request, 1)
      .then(results => {
        res.status(200).json({ result: results.meta });
      })
      .catch(error => {
        throw error;
      });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}
