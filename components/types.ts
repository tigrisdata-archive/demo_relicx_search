export type SearchStateType = {
  query: string;
  page: number;
  size: number;
  order: 'asc' | 'desc';
  dateStart?: string;
  dateEnd?: string;
  searchedFields?: string[];
  searchFieldQueryPair: string;
  filterFields: { value: string; fieldName: string }[];
};

export type ResultDataType = {
  result: ISearchResult;
  loading: boolean;
  error?: string;
};
export type MetaStateType = {
  matchedFields?: string[];
  loading: boolean;
  error?: string;
};

export type ISearchResponse = {
  result?: ISearchResult;
  error: string;
};
export type IMetaResponse = {
  result?: IMetaResult;
  error: string;
};

export type IMetaResult = {
  matchedFields: string[];
};

export type EachRow = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  document: { [key: string]: any };
};
export type ISearchResult = {
  hits: EachRow[];
  facets: IFacets;
  meta: {
    found: number;
    totalPages: number;
    page: {
      current: number;
      size: number;
    };
    matchedFields?: string[];
  };
};

export type IFacets = {
  [k in string]: IFacetEach;
};

export type IFacetEach = {
  counts: {
    count: number;
    value: string;
  }[];
  stats: IStatsEach;
};

export type IStatsEach = {
  avg?: string;
  count?: number;
  max?: number;
  min?: number;
  sum?: number;
};
