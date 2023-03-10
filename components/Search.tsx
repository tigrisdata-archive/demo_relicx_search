import { useEffect, useMemo, useState } from 'react';
import { Tab, TabList, Title } from '@tremor/react';
import { ISearchResponse, ISearchResult, ResultDataType, SearchStateType } from './types';
import QueryDateSelector from './QueryDateSelector';
import Results from './Results';
import SampleDetail from './SampleDetail';
import moment from 'moment';

const result: ISearchResult = {
  _hits: [],
  _facets: {},
  _meta: { _found: 0, _totalPages: 0, _page: { _current: 0, _size: 0 } },
};

export default function Search() {
  const [selectedView, setSelectedView] = useState(1);

  const [searchedState, setSearchedState] = useState<SearchStateType>({
    query: '',
    page: 1,
    size: 50,
    order: 'asc',
  });

  const [resultData, setResultData] = useState<ResultDataType>({
    result,
    loading: true,
  });

  const getStartAndEndDates = useMemo(() => {
    if (searchedState.dateStart && searchedState.dateEnd) {
      return `&dateStart=${searchedState.dateStart}&dateEnd=${searchedState.dateEnd}`;
    } else if (searchedState.dateStart && !searchedState.dateEnd) {
      return `&dateStart=${searchedState.dateStart}&dateEnd=${searchedState.dateStart}`;
    } else {
      return '';
    }
  }, [searchedState.dateEnd, searchedState.dateStart]);

  useEffect(() => {
    async function getData() {
      const URL = `/api/items/search?q=${searchedState.query}&page=${searchedState.page}&size=${searchedState.size}&order=${searchedState.order}${getStartAndEndDates}`;
      const response = await fetch(URL);
      const actualData: ISearchResponse = await response.json();
      if (actualData.result) {
        setResultData({ result: actualData.result, loading: false });
      } else {
        setResultData({ result, loading: false, error: actualData.error ? actualData.error : `Something went wrong!` });
      }
    }
    getData();
  }, [getStartAndEndDates, searchedState.order, searchedState.page, searchedState.query, searchedState.size]);

  return (
    <main className='bg-slate-50 p-6 sm:p-10'>
      <Title>Dashboard</Title>
    </main>
  );
}
