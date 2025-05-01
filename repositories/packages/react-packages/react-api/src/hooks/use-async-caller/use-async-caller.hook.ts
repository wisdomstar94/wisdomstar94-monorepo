'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { IUseAsyncCaller } from './use-async-caller.interface';

const defaultValuesStatic: Required<IUseAsyncCaller.DefaultValues> = {
  retryCount: 0,
  retryDelay: 1500,
  loadingEndedBounceTime: 400,
};

export function useAsyncCaller<T extends (...args: never[]) => Promise<Awaited<ReturnType<T>>>>(
  props: IUseAsyncCaller.Props<T>
) {
  const { asyncFn, defaultValues, errorCase, noRetryCase, onSuccess, onError } = props;

  const defaultRetryCount = useMemo(() => {
    return defaultValues?.retryCount ?? defaultValuesStatic.retryCount;
  }, [defaultValues?.retryCount]);

  const defaultRetryDelay = useMemo(() => {
    return defaultValues?.retryDelay ?? defaultValuesStatic.retryDelay;
  }, [defaultValues?.retryDelay]);

  const defaultLoadingEndedBounceTime = useMemo(() => {
    return defaultValues?.loadingEndedBounceTime ?? defaultValuesStatic.loadingEndedBounceTime;
  }, [defaultValues?.loadingEndedBounceTime]);

  const [isResolved, setIsResolved] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(isLoading);
  // const retryTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const changeLoadingTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [result, setResult] = useState<Awaited<ReturnType<T>> | undefined>(undefined);
  const [error, setError] = useState<unknown | undefined>(undefined);

  function _changeIsLoading(v: boolean, loadingEndedBounceTime: number) {
    if (v) {
      isLoadingRef.current = v;
      setIsLoading(v);
    } else {
      if (loadingEndedBounceTime === 0) {
        isLoadingRef.current = false;
        setIsLoading(false);
      } else {
        changeLoadingTimerRef.current = setTimeout(() => {
          isLoadingRef.current = false;
          setIsLoading(false);
        }, loadingEndedBounceTime);
      }
    }
  }

  function getCaller(callerOptions?: IUseAsyncCaller.CallOptions) {
    const call = async (...args: Parameters<T>) => {
      if (isLoadingRef.current) {
        return undefined;
      }
      _changeIsLoading(true, 0);
      let retriedCount = 0;

      const retryCount = callerOptions?.retryCount ?? defaultRetryCount;
      const retryDelay = callerOptions?.retryDelay ?? defaultRetryDelay;
      const loadingEndedBounceTime = callerOptions?.loadingEndedBounceTime ?? defaultLoadingEndedBounceTime;

      async function _call() {
        try {
          const res = await asyncFn(...args);
          if (typeof errorCase === 'function') {
            const { isError, error } = errorCase(res);
            if (isError) {
              throw error;
            }
          }
          setResult(res);
          setIsResolved(true);
          if (typeof onSuccess === 'function') {
            onSuccess(res);
          }
          _changeIsLoading(false, loadingEndedBounceTime);
          return res;
        } catch (e) {
          if (retryCount === 0) {
            setError(e);
            _changeIsLoading(false, loadingEndedBounceTime);
            if (typeof onError === 'function') {
              onError(e);
              return;
            } else {
              throw e;
            }
          }
          if (typeof noRetryCase === 'function' && noRetryCase(e)) {
            setError(e);
            _changeIsLoading(false, loadingEndedBounceTime);
            if (typeof onError === 'function') {
              onError(e);
              return;
            } else {
              throw e;
            }
          }
          if (retriedCount < retryCount) {
            retriedCount++;
            await new Promise((resolve) => setTimeout(() => resolve(1), retryDelay));
            return _call();
          } else {
            setError(e);
            _changeIsLoading(false, loadingEndedBounceTime);
            if (typeof onError === 'function') {
              onError(e);
              return;
            } else {
              throw e;
            }
          }
        }
      }

      return await _call();
    };

    return { call };
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return {
    isResolved,
    isMounted,
    isLoading,
    isLoadingOrMounting: !isMounted || isLoading,
    isLoadingRef,
    getCaller,
    result,
    error,
  };
}
