import DataTable, { TableColumn } from 'react-data-table-component';
import moment from 'moment';
import { EachRow, ISearchResult } from './types';
import Paginator from './Paginator';
import { pagination } from './utils';

const columns: TableColumn<EachRow>[] = [
  {
    name: 'timestamp',
    selector: (row: EachRow) => {
      return (
        <>
          <a
            href={`https://app.relicx.ai/${row.document.indexed_properties['appId']}/session/${row.document.indexed_properties['sessionId']}`}
            className='text-cyan-800 hover:underline'
            target='_blank'>
            {`${moment(row.document.indexed_properties['timestamp'] / 1000).format('MMMM Do YYYY, h:mm:ss a')}`}
          </a>
        </>
      );
    },
  },

  // {
  //   name: 'timestamp',
  //   selector: (row: EachRow) => {
  //     let dateUnix = row.document.indexed_properties['timestamp'];
  //     dateUnix = dateUnix.substring(0, dateUnix.length - 3);
  //     return `${moment(Number(dateUnix)).utc().format('yyyy-MM-DDTHH:mm:ss.SSSZ')}`;
  //   },
  // },

  {
    name: 'session',
    selector: (row: EachRow) => row.document.indexed_properties['entryUrl'],
  },
  {
    name: 'browser',
    selector: (row: EachRow) => row.document.indexed_properties['browser'],
  },
  {
    name: 'hostname',
    selector: (row: EachRow) => row.document.indexed_properties['hostname'],
  },
];

type Props = {
  data: ISearchResult;
  updatePageTo?: Function;
};

export const DataTablePagination = ({ data, updatePageTo }: Props) => {
  const pages = pagination(data.meta.page.current, data.meta.totalPages);

  return (
    <div className='rounded-2xl '>
      <Paginator
        dataToMap={pages}
        updateCurrentPageTo={(pageTo: number) => {
          if (pageTo > data.meta.totalPages || pageTo < 1) {
            return;
          }
          updatePageTo && updatePageTo(pageTo);
        }}
        currentPage={data.meta.page.current}
      />
      <DataTable className='mt-4 border-2 border-slate-110' columns={columns} data={data.hits} expandableRows={false} />
    </div>
  );
};
