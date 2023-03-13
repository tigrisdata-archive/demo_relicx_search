import { useEffect } from 'react';

interface UseClickOutsideProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: React.RefObject<any>;
  callback: (e?: MouseEvent) => void;
  enable?: boolean;
}

export const useClickOutside = ({ ref, callback, enable }: UseClickOutsideProps) => {
  useEffect(() => {
    if (typeof enable === 'undefined' || enable === true) {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback(event);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return undefined;
  }, [ref, callback, enable]);
};
