import { Block, Bold, Card, ColGrid, Flex, Title, Text, BarList, Subtitle, BarChart } from '@tremor/react';
import KpiCard from './KpiCard';

const data = [
  { name: 'Twitter', value: 456, href: 'https://twitter.com/tremorlabs' },
  { name: 'Google', value: 351, href: 'https://google.com' },
  { name: 'GitHub', value: 271, href: 'https://github.com/tremorlabs/tremor' },
  { name: 'Reddit', value: 191, href: 'https://reddit.com' },
  { name: 'Youtube', value: 91, href: 'https://www.youtube.com/@tremorlabs3079' },
];

const chartdata2 = [
  {
    topic: 'Topic 1',
    'Group A': 890,
    'Group B': 338,
    'Group C': 538,
    'Group D': 396,
    'Group E': 138,
    'Group F': 436,
  },
  {
    topic: 'Topic 2',
    'Group A': 289,
    'Group B': 233,
    'Group C': 253,
    'Group D': 333,
    'Group E': 133,
    'Group F': 533,
  },
];

const dataFormatter = (number: number) => {
  return '$ ' + Intl.NumberFormat('us').format(number).toString();
};

export default function SampleDetail() {
  return (
    <>
      <ColGrid numCols={3} gapX='gap-x-6' gapY='gap-y-6' marginTop='mt-6'>
        <Card>
          <KpiCard></KpiCard>
          <div className='h-28' />
        </Card>

        <Card>
          <Title>Website Analytics</Title>
          <Flex marginTop='mt-4'>
            <Text>
              <Bold>Source</Bold>
            </Text>
            <Text>
              <Bold>Visits</Bold>
            </Text>
          </Flex>
          <BarList data={data} marginTop='mt-2' />
        </Card>

        <Card>
          <Text>Sample block area</Text>
          <div className='h-28' />
        </Card>
      </ColGrid>

      <Card marginTop='mt-6'>
        <Title>Number of species threatened with extinction (2021)</Title>
        <Subtitle>The IUCN Red List has assessed only a small share of the total known species in the world.</Subtitle>
        <BarChart
          data={chartdata2}
          dataKey='topic'
          categories={['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F']}
          colors={['blue', 'teal', 'amber', 'rose', 'indigo', 'emerald']}
          valueFormatter={dataFormatter}
          marginTop='mt-6'
          yAxisWidth='w-12'
        />
      </Card>

      <Block marginTop='mt-6'>
        <Card>
          <div className='h-80' />
        </Card>
      </Block>
    </>
  );
}
