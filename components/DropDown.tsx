import { useEffect, useRef, useState } from 'react';
import { useClickOutside } from './hooks/useClickOutside';

type Props = {
  matchedFields?: string[];
  searchedFields?: string[];

  searchFieldUpdated: Function;
};

export default function DropDown({ matchedFields, searchedFields, searchFieldUpdated }: Props) {
  const selectRef = useRef<HTMLDivElement | null>(null);
  const [showDropDown, setShowDropDown] = useState(true);

  useEffect(() => {
    if (searchedFields == undefined) {
      setShowDropDown(true);
    }
  }, [searchedFields]);

  useClickOutside({
    ref: selectRef,
    callback: () => {
      if (searchedFields) {
        setShowDropDown(false);
      }
    },
  });
  return (
    <>
      <div
        ref={selectRef}
        className={`${
          matchedFields && matchedFields.length > 0 && showDropDown ? 'block' : 'hidden'
        } absolute z-10 max-w-xs bg-slate-200  border drop-shadow-l border-gray-300 rounded-b-lg leading-7 p-4`}>
        {matchedFields &&
          matchedFields.map((each, index) => {
            return (
              <span key={index} className='relative inline-block mb-2'>
                <label
                  className='p-2 cursor-pointer hover:bg-sky-200 rounded-lg'
                  onClick={() => {
                    setShowDropDown(false);
                    searchFieldUpdated(each);
                  }}>
                  {each}
                </label>
              </span>
            );
          })}
      </div>
    </>
  );
}
