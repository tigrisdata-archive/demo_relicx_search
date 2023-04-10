import { ColGrid, Col, DateRangePicker } from '@tremor/react';
import { useRef } from 'react';
import DropDown, { RefType } from './DropDown';

type Props = {
  query: string;
  queryUpdated: Function;
  matchedFields?: string[];
  searchedFields?: string[];
  searchFieldQueryPair: string;
  searchFieldUpdated: Function;
  dateUpdated: Function;
  filterFields: { value: string; fieldName: string }[];
};

export default function QueryDateSelector({
  query,
  queryUpdated,
  dateUpdated,
  searchedFields,
  matchedFields,
  searchFieldUpdated,
  searchFieldQueryPair,
  filterFields,
}: Props) {
  const dropDownRef = useRef<RefType>(null);

  return (
    <ColGrid numCols={10} gapX='gap-x-5' marginTop='mt-6'>
      <Col numColSpan={7}>
        <input
          type='text'
          name='search'
          placeholder='Search..'
          autoComplete='off'
          value={query}
          className='text-sm border border-gray-300 rounded-md drop-shadow-sm	p-2 pl-4 min-w-full inline-block focus:outline-none autofill:none'
          style={{ height: '38px' }}
          onChange={e => {
            queryUpdated(e.target.value);
            dropDownRef.current?.openDropDown();
          }}
          onFocus={() => {
            dropDownRef.current?.openDropDown();
          }}
        />

        {/* //Dropdown showing matched fields from response */}
        <div className='relative'>
          <DropDown
            ref={dropDownRef}
            matchedFields={matchedFields}
            searchFieldUpdated={searchFieldUpdated}
            searchedFields={searchedFields}></DropDown>
        </div>
        {/* //List showing searchfields selected for the request */}
        <div className='mt-1 text-sm' style={{ height: '20px' }}>
          {searchedFields && (
            <>
              <span className='text-xs text-gray-800'>{searchFieldQueryPair} as</span>
              {searchedFields.map((each, index) => {
                return (
                  <span key={index}>
                    <label className='pl-1 font-medium'>{each}</label>
                  </span>
                );
              })}

              {filterFields.map((each, index) => {
                return (
                  <span key={index}>
                    <label className='pr-1 '>, {each.value}</label>
                    is
                    <label className='pl-1 font-medium'>{each.fieldName}</label>
                  </span>
                );
              })}

              <span
                className='pl-2 cursor-pointer hover:text-gray-400'
                onClick={() => {
                  searchFieldUpdated('');
                }}>
                [clear]
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
