'use client';

import { useEffect, useRef, useState } from 'react';
import type { IUseDebounce } from './use-debounce.interface';

export function useDebounce(props: IUseDebounce.Props) {
  const { fn } = props;
  const defaultDebounceTime = props.debounceTime;
  const [isPending, setIsPending] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  function call(debounceTime?: number) {
    const applyDebounceTime = debounceTime ?? defaultDebounceTime;

    setIsPending(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fn();
      setIsPending(false);
    }, applyDebounceTime);
  }

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    call,
    isPending,
  };
}
