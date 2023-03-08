import { ColGrid, Col, TextInput, DateRangePicker } from '@tremor/react';

type Props = {
  query: string;
  queryUpdated: Function;
};

export default function QueryDateSelector({ query, queryUpdated }: Props) {
  return (
    <ColGrid numCols={10} gapX='gap-x-5' marginTop='mt-6'>
      <Col numColSpan={7}>
        <TextInput
          placeholder='Search...'
          value={query}
          maxWidth='max-w-none'
          onChange={e => {
            queryUpdated(e.target.value);
          }}
        />
      </Col>
      <Col numColSpan={3}>
        <DateRangePicker placeholder='Select date' enableDropdown={true} maxWidth='max-w-lg' color='blue' />
      </Col>
    </ColGrid>
  );
}
