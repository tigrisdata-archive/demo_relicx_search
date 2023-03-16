import { forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react';
import { useClickOutside } from './hooks/useClickOutside';

type PropsType = {
  matchedFields?: string[];
  searchedFields?: string[];

  searchFieldUpdated: Function;
};

export interface RefType {
  closeDropDown: () => void;
  openDropDownWithCheck: () => void;
}

export default forwardRef(function DropDown(props: PropsType, ref: Ref<RefType>) {
  const { matchedFields, searchedFields, searchFieldUpdated } = props;

  const selectRef = useRef<HTMLDivElement | null>(null);
  const [showDropDown, setShowDropDown] = useState(true);

  const openDropDownWithCheck = () => {
    if (searchedFields) {
      setShowDropDown(false);
    } else {
      setShowDropDown(true);
    }
  };
  const closeDropDown = () => {
    setShowDropDown(false);
  };

  useImperativeHandle(ref, () => ({ openDropDownWithCheck, closeDropDown }));

  useClickOutside({
    ref: selectRef,
    callback: () => {
      if (searchedFields || matchedFields) {
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
        } absolute z-10 top-0 left-1 max-w-xs bg-white drop-shadow-xl border-gray-300 rounded-b-lg leading-7 p-4`}>
        {matchedFields && (
          <>
            <p className='text-xs p-1 text-gray-800'>search in</p>
            {matchedFields.map((each, index) => {
              return (
                <span key={index} className='relative inline-block mb-2 w-full'>
                  <label
                    className='p-2 cursor-pointer hover:bg-orange-100 rounded-md'
                    onClick={() => {
                      setShowDropDown(false);
                      searchFieldUpdated(each);
                    }}>
                    {each}
                  </label>
                </span>
              );
            })}
          </>
        )}
      </div>
    </>
  );
});
