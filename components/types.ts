export type SearchStateType = {
  query: string;
  page: number;
  size: number;
  order: 'asc' | 'desc';
  dateStart?: string;
  dateEnd?: string;
  searchedFields?: string[];
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
