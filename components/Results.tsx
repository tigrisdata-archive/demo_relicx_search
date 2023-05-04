import { Text, Card, Title, Flex, Metric, Bold, BarList, DonutChart, ColGrid, Col } from '@tremor/react';
import { IFacets, ISearchResult, IStatsEach } from './types';
import { useMemo } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import MapChartWithToolTip from './MapChartWithToolTip';
import { DataTablePagination } from './DataTablePagination';

type Props = {
  data: ISearchResult;
  updatePageTo?: Function;
  className?: string;
};

const MapDataForBarlistFromAFacet = (facetKey: string, facet: IFacets) => {
  let mapped: { name: string; value: number }[] = [];
  let stats: IStatsEach = {};
  if (facetKey in facet) {
    const bData = facet[facetKey];
    mapped = bData.counts.slice(0, 5).map(each => {
      if (each.value === '') {
        return { name: 'Not Set', value: each.count };
      }
      return { name: each.value, value: each.count };
    });
    stats = bData.stats;
  }
  return { counts: mapped, stats };
};

const valueFormatter = (number: number) => `Count ${number.toString()}`;

export default function Results({ data, updatePageTo, className }: Props) {
  const entryUrlData = useMemo(() => {
    return MapDataForBarlistFromAFacet('indexed_properties.entryUrl', data.facets);
  }, [data.facets]);

  const userEmailData = useMemo(() => {
    return MapDataForBarlistFromAFacet('indexed_properties.userVars.email', data.facets);
  }, [data.facets]);

  const userTenantData = useMemo(() => {
    return MapDataForBarlistFromAFacet('indexed_properties.userVars.tenant', data.facets);
  }, [data.facets]);

  const cityData = useMemo(() => {
    return MapDataForBarlistFromAFacet('indexed_properties.geoCoordinates.city', data.facets);
  }, [data.facets]);

  return (
    <div className={className}>
      <ColGrid numCols={8} gapX='gap-x-6' gapY='gap-y-6' marginTop='mt-1'>
        <Col numColSpan={2}>
          <Card marginTop='mt-0' decoration='top' decorationColor={'indigo'}>
            <Text> Total results </Text>
            <Metric> {data.meta.found} </Metric>
            <Text>{data.meta.page.size} results per page</Text>
          </Card>

          <Card marginTop='mt-4'>
            <Title>Top URLs</Title>
            <Flex marginTop='mt-4'>
              <Text>
                <Bold>Source</Bold>
              </Text>
              <Text>
                <Bold>Counts</Bold>
              </Text>
            </Flex>
            <BarList data={entryUrlData.counts} marginTop='mt-2' />
          </Card>

          <Card marginTop='mt-4'>
            <Title>Top Users</Title>
            <Flex marginTop='mt-4'>
              <Text>
                <Bold>Source</Bold>
              </Text>
              <Text>
                <Bold>Counts</Bold>
              </Text>
            </Flex>
            <BarList data={userEmailData.counts} marginTop='mt-2' />
          </Card>

          <Card marginTop='mt-4'>
            <Title>Top Tenants</Title>
            <Flex marginTop='mt-4'>
              <Text>
                <Bold>Source</Bold>
              </Text>
              <Text>
                <Bold>Counts</Bold>
              </Text>
            </Flex>
            <BarList data={userTenantData.counts} marginTop='mt-2' />
          </Card>

          <Card marginTop='mt-4'>
            <Title>Device</Title>
            <DonutChart
              data={data.facets['indexed_properties.device'] ? data.facets['indexed_properties.device'].counts : []}
              category='count'
              dataKey='value'
              marginTop='mt-0'
              valueFormatter={valueFormatter}
              colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
            />
          </Card>
        </Col>

        <Col numColSpan={6}>
          <ColGrid numCols={4} gapX='gap-x-6' gapY='gap-y-6'>
            <Col numColSpan={1}>
              <Card decoration='top'>
                <Title>Top Cities</Title>
                <Flex marginTop='mt-4'>
                  <Text>
                    <Bold>Source</Bold>
                  </Text>
                  <Text>
                    <Bold>Counts</Bold>
                  </Text>
                </Flex>
                <BarList data={cityData.counts} marginTop='mt-2' />
              </Card>
              <Card decoration='top' decorationColor={'amber'} marginTop='mt-4'>
                <Title>Browser</Title>
                <DonutChart
                  data={
                    data.facets['indexed_properties.browser'] ? data.facets['indexed_properties.browser'].counts : []
                  }
                  category='count'
                  dataKey='value'
                  marginTop='mt-0'
                  valueFormatter={valueFormatter}
                  colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
                />
              </Card>
            </Col>
            <Col numColSpan={1}>
              <Card decoration='top' decorationColor={'rose'}>
                <Title>Platform</Title>
                <DonutChart
                  data={
                    data.facets['indexed_properties.platform'] ? data.facets['indexed_properties.platform'].counts : []
                  }
                  category='count'
                  dataKey='value'
                  marginTop='mt-0'
                  valueFormatter={valueFormatter}
                  colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
                  height='h-64'
                />
              </Card>

              <Card decoration='top' decorationColor={'cyan'} marginTop='mt-4'>
                <Title>Language</Title>
                <DonutChart
                  data={
                    data.facets['indexed_properties.language'] ? data.facets['indexed_properties.language'].counts : []
                  }
                  category='count'
                  dataKey='value'
                  marginTop='mt-0'
                  valueFormatter={valueFormatter}
                  colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
                />
              </Card>
            </Col>

            <Col numColSpan={2}>
              <MapChartWithToolTip
                data={data.facets['indexed_properties.geoCoordinates.countryName']}></MapChartWithToolTip>
            </Col>
          </ColGrid>

          <DataTablePagination data={data} updatePageTo={updatePageTo}></DataTablePagination>
        </Col>
      </ColGrid>
    </div>
  );
}
