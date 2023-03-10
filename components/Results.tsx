import {
  Text,
  Card,
  Title,
  Flex,
  Subtitle,
  Metric,
  Bold,
  BarList,
  DonutChart,
  BarChart,
  ColGrid,
  Col,
} from '@tremor/react';
import { IFacets, ISearchResult, IStatsEach } from './types';
import { useMemo } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import MapChartWithToolTip from './MapChartWithToolTip';
import { DataTablePagination } from './DataTablePagination';

type Props = {
  data: ISearchResult;
  setSearchedState?: Function;
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

export default function Results({ data, setSearchedState }: Props) {
  const browserBarListData = useMemo(() => {
    return MapDataForBarlistFromAFacet('record.geo_coordinates.city', data._facets);
  }, [data._facets]);

  const platformBarListData = useMemo(() => {
    return MapDataForBarlistFromAFacet('record.platform', data._facets);
  }, [data._facets]);

  return (
    <>
      <ColGrid numCols={8} gapX='gap-x-6' gapY='gap-y-6' marginTop='mt-6'>
        <Col numColSpan={2}>
          <Card marginTop='mt-0' decoration='top' decorationColor={'indigo'}>
            <Text> Total results </Text>
            <Metric> {data._meta._found} </Metric>
            <Text>{data._meta._page._size} results per page</Text>
          </Card>

          <Card marginTop='mt-4'>
            <Title>City</Title>
            <Flex marginTop='mt-4'>
              <Text>
                <Bold>Source</Bold>
              </Text>
              <Text>
                <Bold>Counts</Bold>
              </Text>
            </Flex>
            <BarList data={browserBarListData.counts} marginTop='mt-2' />
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

          <DataTablePagination data={data} setSearchedState={setSearchedState}></DataTablePagination>
        </Col>
      </ColGrid>
    </>
  );
}
