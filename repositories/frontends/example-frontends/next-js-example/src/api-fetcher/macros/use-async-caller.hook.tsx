'use client';

import { useEffect, useRef, useState } from 'react';
import { createPublicError, isPublicError, PublicError } from './public-error';

export type UseAsyncCallerProps<T extends (...args: never[]) => ReturnType<T>> = {
  fn: T;
};

export function useAsyncCaller<T extends (...args: never[]) => ReturnType<T>>(props: UseAsyncCallerProps<T>) {
  const { fn } = props;

  const [isFetched, setIsFetched] = useState(false);

  const [isMounting, setIsMounting] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const [result, setResult] = useState<ReturnType<T> | undefined>(undefined);
  const [error, setError] = useState<unknown | undefined>(undefined);

  function changeIsLoading(v: boolean) {
    isLoadingRef.current = v;
    setIsLoading(v);
  }

  function detectPublicError(error: PublicError) {
    setError(error);
    console.error(`#detectPublicError.error`, error);
  }

  async function detectResponseError(error: Response) {
    console.error(`#detectResponseError.status`, error.status);
    const body = await (async () => {
      try {
        return await error.clone().json();
      } catch (e) {
        return await error.clone().text();
      }
    })();

    if (isPublicError(body)) {
      detectPublicError(body);
    } else {
      setError(
        createPublicError({
          errorCode: '...',
          message: `에러 발생: ${Date.now()}`,
        })
      );
    }
  }

  async function call(...args: Parameters<T>) {
    if (isLoadingRef.current) {
      return { result: undefined, error: undefined };
    }

    try {
      changeIsLoading(true);
      const result = fn(...args);

      setIsFetched(true);
      changeIsLoading(false);
      const value = result instanceof Promise ? await result : result;
      if (isPublicError(value)) {
        throw value;
      }
      setResult(value);
      return { result: value };
    } catch (e) {
      changeIsLoading(false);
      if (isPublicError(e)) {
        detectPublicError(e);
      }
      if (e instanceof Response) {
        detectResponseError(e);
      }
      setError(e);
      return { error: e };
      // global error handling..
    }
  }

  useEffect(() => {
    setIsMounting(false);
  }, []);

  return {
    call,
    isFetched,
    isLoading,
    isLoadingOrMounting: isLoading || isMounting,
    isMounting,
    result,
    error,
  };
}
