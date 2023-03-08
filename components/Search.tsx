import { useEffect, useState } from 'react';
import { Tab, TabList, Title } from '@tremor/react';
import { ISearchResponse, ISearchResult, ResultDataType, SearchStateType } from './types';
import QueryDateSelector from './QueryDateSelector';
import Results from './Results';
import SampleDetail from './SampleDetail';

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

  useEffect(() => {
    async function getData() {
      const response = await fetch(
        `/api/items/search?q=${searchedState.query}&page=${searchedState.page}&size=${searchedState.size}&order=${searchedState.order}`
      );
      const actualData: ISearchResponse = await response.json();
      if (actualData.result) {
        setResultData({ result: actualData.result, loading: false });
      } else {
        setResultData({ result, loading: false, error: actualData.error ? actualData.error : `Something went wrong!` });
      }
    }
    getData();
  }, [searchedState]);

  return (
    <main className='bg-slate-50 p-6 sm:p-10'>
      <Title>Dashboard</Title>

      <button className='rounded-full'>Save Changes</button>

      <QueryDateSelector
        query={searchedState.query}
        queryUpdated={(q: string) => {
          setSearchedState(state => ({ ...state, query: q }));
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
