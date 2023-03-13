import { ColGrid, Col, TextInput, DateRangePicker } from '@tremor/react';
import DropDown from './DropDown';

type Props = {
  query: string;
  queryUpdated: Function;
  matchedFields?: string[];
  searchedFields?: string[];
  searchFieldUpdated: Function;
  dateUpdated: Function;
};

export default function QueryDateSelector({
  query,
  queryUpdated,
  dateUpdated,
  searchedFields,
  matchedFields,
  searchFieldUpdated,
}: Props) {
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
        {/* //Dropdown showing matched fields from response */}
        <div className='relative'>
          <DropDown
            matchedFields={matchedFields}
            searchFieldUpdated={searchFieldUpdated}
            searchedFields={searchedFields}></DropDown>
        </div>
        {/* //List showing searchfields selected for the request */}
        <div className='mt-1 text-sm' style={{ height: '20px' }}>
          {searchedFields && (
            <>
              {searchedFields.map((each, index) => {
                {
                  return (
                    <>
                      <span key={index}>
                        <label className='p-1 font-medium'>{each}</label>
                      </span>
                    </>
                  );
                }
              })}
              <span
                className='pl-2'
                onClick={() => {
                  searchFieldUpdated('');
                }}>
                [clear all]
              </span>
            </>
          )}
        </div>
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
