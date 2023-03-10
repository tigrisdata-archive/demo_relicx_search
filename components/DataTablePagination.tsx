import DataTable, { TableColumn } from 'react-data-table-component';
import moment from 'moment';
import { ISearchResult } from './types';
import Paginator from './Paginator';
import { pagination } from './utils';

type EachRow = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _document: { [key: string]: any };
};

const columns: TableColumn<EachRow>[] = [
  {
    name: 'created_at',
    selector: (row: EachRow) => {
      return `${moment(row._document['created_at']).utc().format('MMMM Do YYYY, h:mm:ss a')}`;
    },
  },

  // {
  //   name: 'timestamp',
  //   selector: (row: EachRow) => {
  //     let dateUnix = row._document.record['timestamp'];
  //     dateUnix = dateUnix.substring(0, dateUnix.length - 3);
  //     return `${moment(Number(dateUnix)).utc().format('yyyy-MM-DDTHH:mm:ss.SSSZ')}`;
  //   },
  // },

  {
    name: 'entry_url',
    selector: (row: EachRow) => row._document.record['entry_url'],
  },
  {
    name: 'origin',
    selector: (row: EachRow) => row._document.record['origin'],
  },
  {
    name: 'browser',
    selector: (row: EachRow) => row._document.record['browser'],
  },
  {
    name: 'vendor',
    selector: (row: EachRow) => row._document.record['vendor'],
  },
  {
    name: 'hostname',
    selector: (row: EachRow) => row._document.record['hostname'],
  },
  {
    name: 'user_agent',
    selector: (row: EachRow) => row._document.record['user_agent'],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ExpandedComponent = ({ data }: any) => {
  return (
    <>
      <pre className='text-xs leading-tight p-6'>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};
type Props = {
  data: ISearchResult;
  setSearchedState?: Function;
};

export const DataTablePagination = ({ data, setSearchedState }: Props) => {
  const pages = pagination(data._meta._page._current, data._meta._totalPages);

  return (
    <div className='rounded-2xl'>
      <DataTable
        className='mt-6 border-2 border-slate-110'
        columns={columns}
        data={data._hits}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
      />

      <Paginator
        dataToMap={pages}
        updateCurrentPageTo={(pageTo: number) => {
          if (pageTo > data._meta._totalPages || pageTo < 1) {
            return;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setSearchedState && setSearchedState((state: any) => ({ ...state, page: pageTo }));
        }}
        currentPage={data._meta._page._current}
      />
    </div>
  );
};
