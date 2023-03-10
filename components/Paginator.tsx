import React from 'react';
import Image from 'next/image';

type Props = { updateCurrentPageTo: Function; currentPage: number; dataToMap: (string | number)[] };

const Paginator = ({ updateCurrentPageTo, currentPage, dataToMap }: Props) => (
  <div className='mt-3 flex flex-row-reverse'>
    <ul className='flex flex-row paginator'>
      <li
        onClick={e => {
          e.preventDefault();
          updateCurrentPageTo(currentPage - 1);
        }}
        className={`arrow arrow-prev ${currentPage !== 1 ? ' ' : 'hidden'}`}>
        <Image src='/arrow-up.svg' alt='Back' width={18} height={18} />
      </li>

      {dataToMap.map((each, i) => (
        <li
          key={i}
          onClick={e => {
            e.preventDefault();
            if (typeof each === 'number' && currentPage != each) {
              updateCurrentPageTo(each);
            }
          }}
          className={`page-item ${typeof each === 'number' && each == currentPage ? 'active ' : ''}`}>
          {each}
        </li>
      ))}

      <li
        onClick={e => {
          e.preventDefault();
          updateCurrentPageTo(currentPage + 1);
        }}
        className={`arrow arrow-next ${currentPage !== dataToMap.length ? ' ' : 'hidden'}`}>
        <Image src='/arrow-up.svg' alt='Back' width={18} height={18} />
      </li>
    </ul>
  </div>
);

export default Paginator;
