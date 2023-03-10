import DataTable, { TableColumn } from 'react-data-table-component';
import moment from 'moment';
import { EachRow, ISearchResult } from './types';
import Paginator from './Paginator';
import { pagination } from './utils';

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

const ExpandedComponent = ({ data }: { data: EachRow }) => {
  return (
    <>
      <pre className='text-xs leading-tight p-6'>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};
type Props = {
  data: ISearchResult;
  updatePageTo?: Function;
};

export const DataTablePagination = ({ data, updatePageTo }: Props) => {
  const pages = pagination(data._meta._page._current, data._meta._totalPages);

  return (
    <div className='rounded-2xl '>
      <Paginator
        dataToMap={pages}
        updateCurrentPageTo={(pageTo: number) => {
          if (pageTo > data._meta._totalPages || pageTo < 1) {
            return;
          }
          updatePageTo && updatePageTo(pageTo);
        }}
        currentPage={data._meta._page._current}
      />
      <DataTable
        className='mt-4 border-2 border-slate-110'
        columns={columns}
        data={data._hits}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
      />
    </div>
  );
};
