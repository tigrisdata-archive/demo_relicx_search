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
      <QueryDateSelector
        query={searchedState.query}
        queryUpdated={(q: string) => {
          setSearchedState(state => ({ ...state, query: q }));
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
            }));
          }
          if (d[1]) {
            const day = d[1];
            const momentDateEnd = moment(day);
            const momentDateStart = moment(d[0]);
            if (momentDateStart.isSame(momentDateEnd)) {
              momentDateEnd.add(1, 'days').subtract(1, 'ms');
            }
            setSearchedState(state => ({ ...state, dateEnd: momentDateEnd.format('yyyy-MM-DDTHH:mm:ss.SSS') + 'Z' }));
          }
        }}></QueryDateSelector>

      <TabList defaultValue={1} onValueChange={value => setSelectedView(value)} marginTop='mt-6'>
        <Tab value={1} text='Overview' />
        <Tab value={2} text='Detail' />
      </TabList>

      {selectedView === 1 ? (
        <>
          <Results data={resultData.result}></Results>
        </>
      ) : (
        <SampleDetail></SampleDetail>
      )}
    </main>
  );
}
