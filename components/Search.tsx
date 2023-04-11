import { useEffect, useMemo, useRef, useState } from 'react';
import { Title, Text } from '@tremor/react';
import { IMetaResponse, ISearchResponse, ISearchResult, MetaStateType, ResultDataType, SearchStateType } from './types';
import QueryDateSelector from './QueryDateSelector';
import Results from './Results';
import moment from 'moment';
import BarLoader from 'react-spinners/BarLoader';

const result: ISearchResult = {
  hits: [],
  facets: {},
  meta: { found: 0, totalPages: 0, page: { current: 0, size: 0 } },
};

const RelaxTrigger = 650;

export default function Search() {
  const ref = useRef<number>(RelaxTrigger);

  //Local State
  const [searchedState, setSearchedState] = useState<SearchStateType>({
    query: '',
    page: 1,
    size: 20,
    order: 'desc',
    searchFieldQueryPair: '',
    filterFields: [],
  });

  const [matchedFieldData, setMatchedFieldData] = useState<MetaStateType>({
    loading: true,
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

  const getSearchedFields = useMemo(() => {
    if (searchedState.searchedFields) {
      const str = searchedState.searchedFields.join();
      return `&searchFields=${str}`;
    } else {
      return '';
    }
  }, [searchedState.searchedFields]);

  useEffect(() => {
    async function getData() {
      setResultData(state => ({ ...state, loading: true }));

      const URL = `/api/items/searchv2`;
      //?q=${searchedState.searchFieldQueryPair}&page=${searchedState.page}&size=${searchedState.size}&order=${searchedState.order}${getStartAndEndDates}${getSearchedFields}

      try {
        const response = await fetch(URL, {
          method: 'POST',
          body: JSON.stringify({
            q: searchedState.searchFieldQueryPair,
            searchFields: searchedState.searchedFields,
            filters: searchedState.filterFields.map(element => {
              return { field: element.fieldName, operator: 'eq', value: element.value };
            }),
            page: searchedState.page,
            size: searchedState.size,
            order: searchedState.order,
            dateStart: searchedState.dateStart ? searchedState.dateStart : '',
            dateEnd: searchedState.dateEnd
              ? searchedState.dateEnd
              : searchedState.dateStart
              ? searchedState.dateStart
              : '',
          }),
        });
        if (response.ok) {
          const actualData: ISearchResponse = await response.json();
          if (actualData.result) {
            setResultData({ result: actualData.result, loading: false });
          } else {
            throw new Error('No results..');
          }
        } else {
          throw new Error('Incorrect Status');
        }
      } catch (error) {
        let message = 'Unknown Error';
        if (error instanceof Error) message = error.message;

        setResultData({
          result,
          loading: false,
          error: `Something went wrong! ${message}`,
        });
      }
    }

    const timer = setTimeout(() => {
      getData();
      ref.current = RelaxTrigger;
    }, ref.current);

    return () => {
      clearTimeout(timer);
    };
  }, [
    getStartAndEndDates,
    searchedState.order,
    searchedState.page,
    searchedState.size,
    getSearchedFields,
    searchedState.searchFieldQueryPair,
    searchedState.searchedFields,
    searchedState.filterFields,
    searchedState.dateStart,
    searchedState.dateEnd,
  ]);

  //Meta call when query changes
  useEffect(() => {
    async function getData() {
      setMatchedFieldData(state => ({ ...state, loading: true }));

      const URL = `/api/items/search-meta?q=${searchedState.query}`;

      try {
        const response = await fetch(URL);
        if (response.ok) {
          const actualData: IMetaResponse = await response.json();

          if (actualData.result) {
            setMatchedFieldData(state => ({
              ...state,
              loading: false,
              matchedFields: actualData.result ? actualData.result.matchedFields : undefined,
            }));
          } else {
            throw new Error('No meta results..');
          }
        } else {
          throw new Error('Incorrect Status');
        }
      } catch (error) {
        let message = 'Unknown Error';
        if (error instanceof Error) message = error.message;

        setResultData({
          result,
          loading: false,
          error: `Something went wrong! ${message}`,
        });
      }
    }

    const timer = setTimeout(() => {
      getData();
      ref.current = RelaxTrigger;
    }, ref.current);

    return () => {
      clearTimeout(timer);
    };
  }, [searchedState.query]);

  return (
    <main className='relative bg-slate-50 p-6 sm:p-10'>
      <div className='flex flex-row items-center justify-between'>
        <Title>Dashboard</Title>
        <Text color='rose' textAlignment='text-left' truncate={false} height='' marginTop='mt-0'>
          {resultData.error}
        </Text>
      </div>
      <QueryDateSelector
        query={searchedState.query}
        queryUpdated={(q: string) => {
          setSearchedState(state => ({ ...state, query: q }));
          setMatchedFieldData(state => ({
            ...state,
            loading: false,
            matchedFields: [],
          }));
        }}
        matchedFields={matchedFieldData.matchedFields}
        searchedFields={searchedState.searchedFields}
        searchFieldQueryPair={searchedState.searchFieldQueryPair}
        filterFields={searchedState.filterFields}
        searchFieldUpdated={(selected: string) => {
          ref.current = 0;

          if (selected == '') {
            setSearchedState(state => ({
              ...state,
              page: 1,
              query: '',
              searchedFields: undefined,
              searchFieldQueryPair: '',
              filterFields: [],
            }));
          } else if (searchedState.searchedFields && searchedState.searchedFields.length > 0) {
            setSearchedState(state => ({
              ...state,
              page: 1,
              query: state.query,
              filterFields: [...state.filterFields, { value: state.query, fieldName: selected }],
            }));
          } else {
            setSearchedState(state => ({
              ...state,
              page: 1,
              query: state.query,
              searchedFields: [selected],
              searchFieldQueryPair: state.query,
            }));
          }

          setResultData(state => ({
            ...state,
            result: selected == '' ? result : state.result,
          }));
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
      <div className='relative mt-1 h-2'>
        <BarLoader color='#36d7b7' loading={resultData.loading} width={'100%'} className=' rounded' />
      </div>
      <Results
        className={resultData.loading ? 'blur-[2px] pointer-events-none opacity-50 duration-300' : 'duration-1000'}
        data={resultData.result}
        updatePageTo={(pageTo: number) => {
          ref.current = 0;
          setSearchedState(state => ({
            ...state,
            page: pageTo,
          }));
        }}></Results>
    </main>
  );
}
