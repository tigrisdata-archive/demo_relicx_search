import { useEffect, useMemo, useState } from 'react';
import { Title } from '@tremor/react';
import { ISearchResponse, ISearchResult, ResultDataType, SearchStateType } from './types';
import QueryDateSelector from './QueryDateSelector';
import Results from './Results';
import moment from 'moment';
import BarLoader from 'react-spinners/BarLoader';

const result: ISearchResult = {
  _hits: [],
  _facets: {},
  _meta: { _found: 0, _totalPages: 0, _page: { _current: 0, _size: 0 } },
};

export default function Search() {
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
      setResultData(state => ({ ...state, loading: true }));
      const URL = `/api/items/search?q=${searchedState.query}&page=${searchedState.page}&size=${searchedState.size}&order=${searchedState.order}${getStartAndEndDates}`;
      const response = await fetch(URL);
      const actualData: ISearchResponse = await response.json();
      if (actualData.result) {
        setResultData({ result: actualData.result, loading: false });
      } else {
        setResultData({ result, loading: false, error: actualData.error ? actualData.error : `Something went wrong!` });
      }
    }
    const timer = setTimeout(() => {
      getData();
    }, 650);

    return () => {
      clearTimeout(timer);
    };
  }, [getStartAndEndDates, searchedState.order, searchedState.page, searchedState.query, searchedState.size]);

  return (
    <main className='relative bg-slate-50 p-6 sm:p-10'>
      <Title>Dashboard</Title>

      <QueryDateSelector
        query={searchedState.query}
        queryUpdated={(q: string) => {
          setSearchedState(state => ({ ...state, query: q, page: 1 }));
        }}
        dateUpdated={(d: (Date | undefined)[]) => {
          if (d[0]) {
            const day = d[0];
            const momentDateStart = moment(day);
            const momentDateEnd = momentDateStart.clone();
            momentDateEnd.add(1, 'days').subtract(1, 'ms');

            setSearchedState(state => ({
              ...state,
              dateStart: momentDateStart.format('yyyy-MM-DDTHH:mm:ss.SSS') + 'Z',
              dateEnd: momentDateEnd.format('yyyy-MM-DDTHH:mm:ss.SSS') + 'Z',
              page: 1,
            }));
          }
          if (d[1]) {
            const day = d[1];
            const momentDateEnd = moment(day);
            const momentDateStart = moment(d[0]);
            if (momentDateStart.isSame(momentDateEnd)) {
              momentDateEnd.add(1, 'days').subtract(1, 'ms');
            }
            setSearchedState(state => ({
              ...state,
              dateEnd: momentDateEnd.format('yyyy-MM-DDTHH:mm:ss.SSS') + 'Z',
              page: 1,
            }));
          }
        }}></QueryDateSelector>

      <div className='relative mt-3 h-2'>
        <BarLoader color='#36d7b7' loading={resultData.loading} width={'100%'} className=' rounded' />
      </div>

      <Results data={resultData.result} setSearchedState={setSearchedState}></Results>
    </main>
  );
}
