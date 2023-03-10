import {
  Text,
  Card,
  Title,
  Flex,
  Subtitle,
  Metric,
  Bold,
  BarList,
  Legend,
  DonutChart,
  BarChart,
  ColGrid,
  Col,
} from '@tremor/react';
import { IFacets, ISearchResult, IStatsEach } from './types';
import { useMemo } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import moment from 'moment';
import 'react-tooltip/dist/react-tooltip.css';
import MapChartWithToolTip from './MapChartWithToolTip';

type Props = {
  data: ISearchResult;
};

const MapDataForBarlistFromAFacet = (facetKey: string, facet: IFacets) => {
  let mapped: { name: string; value: number }[] = [];
  let stats: IStatsEach = {};
  if (facetKey in facet) {
    const bData = facet[facetKey];
    mapped = bData._counts.map(each => {
      return { name: each._value, value: each._count };
    });
    stats = bData._stats;
  }
  return { counts: mapped, stats };
};

const valueFormatter = (number: number) => `Count ${number.toString()}`;

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

  {
    name: 'timestamp',
    selector: (row: EachRow) => {
      let dateUnix = row._document.record['timestamp'];
      dateUnix = dateUnix.substring(0, dateUnix.length - 3);
      return `${moment(Number(dateUnix)).utc().format('yyyy-MM-DDTHH:mm:ss.SSSZ')}`;
    },
  },

  {
    name: 'session_id',
    selector: (row: EachRow) => row._document.record['session_id'],
  },

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

export default function Results({ data }: Props) {
  const browserBarListData = useMemo(() => {
    return MapDataForBarlistFromAFacet('record.geo_coordinates.city', data._facets);
  }, [data._facets]);

  const platformBarListData = useMemo(() => {
    return MapDataForBarlistFromAFacet('record.platform', data._facets);
  }, [data._facets]);

  return (
    <>
      <ColGrid numCols={8} gapX='gap-x-6' gapY='gap-y-6' marginTop='mt-4'>
        <Col numColSpan={2}>
          <Card marginTop='mt-0' decoration='top' decorationColor={'indigo'}>
            <Text> Total results </Text>
            <Metric> {data._meta._found} </Metric>
            <Text>{data._meta._page._size} results per page</Text>
          </Card>

          <Card marginTop='mt-4'>
            <Title>Browser</Title>
            <Flex marginTop='mt-4'>
              <Text>
                <Bold>Source</Bold>
              </Text>
              <Text>
                <Bold>Counts</Bold>
              </Text>
            </Flex>
            <BarList data={browserBarListData.counts} marginTop='mt-2' />
            <Legend
              categories={[
                `Count ${browserBarListData.stats._count}`,
                `Max ${browserBarListData.stats._max}`,
                `Min ${browserBarListData.stats._min}`,
                `Sum ${browserBarListData.stats._sum}`,
              ]}
              colors={['emerald', 'red', 'orange', 'teal', 'fuchsia']}
              marginTop='mt-3'
            />
          </Card>

          <Card marginTop='mt-4'>
            <Title>Platform</Title>
            <Flex marginTop='mt-4'>
              <Text>
                <Bold>Source</Bold>
              </Text>
              <Text>
                <Bold>Counts</Bold>
              </Text>
            </Flex>
            <BarList data={platformBarListData.counts} marginTop='mt-2' />
            <Legend
              categories={[
                `Count ${platformBarListData.stats._count}`,
                `Max ${platformBarListData.stats._max}`,
                `Min ${platformBarListData.stats._min}`,
                `Sum ${platformBarListData.stats._sum}`,
              ]}
              colors={['emerald', 'red', 'orange', 'teal', 'fuchsia']}
              marginTop='mt-3'
            />
          </Card>

          <Card marginTop='mt-4'>
            <Title>City</Title>
            <Subtitle>Count per city</Subtitle>
            <BarChart
              data={
                data._facets['record.geo_coordinates.city'] ? data._facets['record.geo_coordinates.city']._counts : []
              }
              dataKey='_value'
              categories={['_count']}
              colors={['amber']}
              marginTop='mt-6'
              yAxisWidth='w-12'
            />
          </Card>
        </Col>

        <Col numColSpan={6}>
          <ColGrid numCols={4} gapX='gap-x-6' gapY='gap-y-6'>
            <Col numColSpan={1}>
              <Card decoration='top' decorationColor={'stone'}>
                <Title>Vendor</Title>
                <DonutChart
                  data={data._facets['record.vendor'] ? data._facets['record.vendor']._counts : []}
                  category='_count'
                  dataKey='_value'
                  marginTop='mt-0'
                  valueFormatter={valueFormatter}
                  colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
                />
              </Card>
              <Card decoration='top' decorationColor={'rose'} marginTop='mt-4'>
                <Title>Platform</Title>
                <DonutChart
                  data={data._facets['record.platform'] ? data._facets['record.platform']._counts : []}
                  category='_count'
                  dataKey='_value'
                  marginTop='mt-0'
                  valueFormatter={valueFormatter}
                  colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
                />
              </Card>
            </Col>
            <Col numColSpan={1}>
              <Card decoration='top' decorationColor={'amber'}>
                <Title>Browser</Title>
                <DonutChart
                  data={data._facets['record.browser'] ? data._facets['record.browser']._counts : []}
                  category='_count'
                  dataKey='_value'
                  marginTop='mt-0'
                  valueFormatter={valueFormatter}
                  colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
                />
              </Card>
              <Card decoration='top' decorationColor={'cyan'} marginTop='mt-4'>
                <Title>Language</Title>
                <DonutChart
                  data={data._facets['record.language'] ? data._facets['record.language']._counts : []}
                  category='_count'
                  dataKey='_value'
                  marginTop='mt-0'
                  valueFormatter={valueFormatter}
                  colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
                />
              </Card>
            </Col>

            <Col numColSpan={2}>
              <MapChartWithToolTip data={data._facets['record.geo_coordinates.countryName']}></MapChartWithToolTip>
            </Col>
          </ColGrid>

          <div className='rounded-2xl'></div>
        </Col>
      </ColGrid>
    </>
  );
}
