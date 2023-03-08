import {
  Text,
  Table,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableBody,
  TableCell,
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
} from '@tremor/react';
import { IFacets, ISearchResult, IStatsEach } from './types';
import { useMemo } from 'react';

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

export default function Results({ data }: Props) {
  const browserBarListData = useMemo(() => {
    return MapDataForBarlistFromAFacet('record.browser', data._facets);
  }, [data._facets]);

  const platformBarListData = useMemo(() => {
    return MapDataForBarlistFromAFacet('record.platform', data._facets);
  }, [data._facets]);

  return (
    <>
      <Flex
        justifyContent='justify-between'
        alignItems='items-stretch'
        spaceX='space-x-4'
        truncate={false}
        marginTop='mt-0'>
        <Card marginTop='mt-10' decoration='top' decorationColor={'indigo'}>
          <Text> Total results </Text>
          <Metric> {data._meta._found} </Metric>
          <Text>{data._meta._page._size} results per page</Text>
        </Card>

        <Card marginTop='mt-10'>
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
              `Average ${browserBarListData.stats._avg}`,
              `Count ${browserBarListData.stats._count}`,
              `Max ${browserBarListData.stats._max}`,
              `Min ${browserBarListData.stats._min}`,
              `Sum ${browserBarListData.stats._sum}`,
            ]}
            colors={['emerald', 'red', 'orange', 'teal', 'fuchsia']}
            marginTop='mt-3'
          />
        </Card>

        <Card marginTop='mt-10'>
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
              `Average ${platformBarListData.stats._avg}`,
              `Count ${platformBarListData.stats._count}`,
              `Max ${platformBarListData.stats._max}`,
              `Min ${platformBarListData.stats._min}`,
              `Sum ${platformBarListData.stats._sum}`,
            ]}
            colors={['emerald', 'red', 'orange', 'teal', 'fuchsia']}
            marginTop='mt-3'
          />
        </Card>

        <Card maxWidth='max-w-lg'>
          <Title>Vendor</Title>
          <DonutChart
            data={data._facets['record.vendor'] ? data._facets['record.vendor']._counts : []}
            category='_count'
            dataKey='_value'
            marginTop='mt-6'
            valueFormatter={valueFormatter}
            colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
          />
        </Card>

        <Card maxWidth='max-w-lg'>
          <Title>Device</Title>
          <DonutChart
            data={data._facets['record.device'] ? data._facets['record.device']._counts : []}
            category='_count'
            dataKey='_value'
            marginTop='mt-6'
            valueFormatter={valueFormatter}
            colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
          />
        </Card>
      </Flex>

      <Card marginTop='mt-6'>
        <Title>City</Title>
        <Subtitle>Count per city</Subtitle>
        <BarChart
          data={data._facets['record.geo_coordinates.city'] ? data._facets['record.geo_coordinates.city']._counts : []}
          dataKey='_value'
          categories={['_count']}
          colors={['amber']}
          marginTop='mt-6'
          yAxisWidth='w-12'
        />
      </Card>

      <Card marginTop='mt-6'>
        <Title>Country</Title>
        <Subtitle>Count per country</Subtitle>
        <BarChart
          data={
            data._facets['record.geo_coordinates.countryName']
              ? data._facets['record.geo_coordinates.countryName']._counts
              : []
          }
          dataKey='_value'
          categories={['_count']}
          colors={['rose']}
          marginTop='mt-6'
          yAxisWidth='w-12'
        />
      </Card>

      <Table marginTop='mt-5'>
        <TableHead>
          <TableRow>
            <TableHeaderCell>session_id</TableHeaderCell>
            <TableHeaderCell>org_id</TableHeaderCell>
            <TableHeaderCell>open</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data._hits.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item._document.session_id}</TableCell>

              <TableCell>
                <Text>{item._document.org_id}</Text>
              </TableCell>

              {/* <TableCell>
                <Text>{JSON.stringify(item._document, null, 2)}</Text>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
