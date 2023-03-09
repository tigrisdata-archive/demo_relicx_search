import { ColGrid, Col, TextInput, DateRangePicker } from '@tremor/react';

type Props = {
  query: string;
  queryUpdated: Function;
  dateUpdated: Function;
};

export default function QueryDateSelector({ query, queryUpdated, dateUpdated }: Props) {
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
        <DateRangePicker
          placeholder='Select date'
          enableDropdown={true}
          onValueChange={datePicked => {
            if (datePicked[0]) {
              dateUpdated([datePicked[0] as Date, undefined]);
            }
            if (datePicked[1]) {
              dateUpdated([datePicked[0] as Date, datePicked[1] as Date]);
            }
          }}
          maxWidth='max-w-lg'
          color='blue'
        />
      </Col>
    </ColGrid>
  );
}
