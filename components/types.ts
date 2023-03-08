export type SearchStateType = {
  query: string;
  page: number;
  size: number;
  order: 'asc' | 'desc';
};

export type ResultDataType = {
  result: ISearchResult;
  loading: boolean;
  error?: string;
};

export type ISearchResponse = {
  result?: ISearchResult;
  error: string;
};

export type ISearchResult = {
  _hits: {
    _document: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [K in string]: any;
    };
  }[];
  _facets: IFacets;
  _meta: {
    _found: number;
    _total_pages: number;
    _page: {
      _current: number;
      _size: number;
    };
  };
};

type IFacets = {
  [k in string]: IFacetEach;
};

type IFacetEach = {
  _counts: {
    _count: number;
    _value?: string;
  }[];
  stats: IStatsEach;
};

type IStatsEach = {
  _avg?: string;
  _count: number;
  _max?: number;
  _min?: number;
  _sum?: number;
};
