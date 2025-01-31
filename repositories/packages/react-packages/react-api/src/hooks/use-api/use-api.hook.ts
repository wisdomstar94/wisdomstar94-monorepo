import { useEffect, useRef, useState } from 'react';
import { UseApiCanceledData, UseApiFetchOptions, UseApiInfo, UseApiProps } from './use-api.interface';
import { useDebounce } from '@wisdomstar94/react-debounce';

export function useApi<T>(props: UseApiProps<T>) {
  const { api, autoFetchDependencies, loadingEndedBounceTime = 0 } = props;
  const enabled = props.enabled ?? true;
  const enabledAutoFetch = props.enabledAutoFetch ?? true;
  const retryCountDefault = props.retryCount;
  const retryDelayDefault = props.retryDelay;

  const isLoadingRef = useRef(false);
  const isCancelRef = useRef(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setIsLoadingDebounce = useDebounce({
    fn() {
      setIsLoading(false);
    },
    debounceTime: loadingEndedBounceTime,
  });
  const [error, setError] = useState<any>();
  const [result, setResult] = useState<T>();
  const [canceled, setCanceled] = useState<UseApiCanceledData>();
  const [isMounted, setIsMounted] = useState(false);
  const isLoadingOrMounting = isLoading || !isMounted;

  const apis = useRef<UseApiInfo<T>>(api());
  const retryTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  const clearRetryTimer = () => {
    clearTimeout(retryTimer.current);
    retryTimer.current = undefined;
  };

  const fetch = (options?: UseApiFetchOptions) => {
    if (isLoadingRef.current) return;
    if (!enabled) return;

    apis.current = api();
    setIsLoadingDispose(true);

    const retryCount = options?.retryCount ?? retryCountDefault ?? 0;
    const retryDelay = options?.retryDelay ?? retryDelayDefault;

    let retriedCount = 0;
    isCancelRef.current = false;

    const call = () => {
      apis.current
        .fn()
        .then((value) => {
          setResult(value);
          if (isFetched === false) setIsFetched(true);
          setIsLoadingDispose(false);
        })
        .catch((error) => {
          if (!isCancelRef.current && retriedCount < retryCount) {
            retriedCount++;
            if (retryDelay === undefined) {
              call();
            } else {
              retryTimer.current = setTimeout(() => {
                call();
              }, retryDelay);
            }
            return;
          }
          isCancelRef.current = false;
          setError(error);
          setIsLoadingDispose(false);
        });
    };
    call();
  };

  const cancel = () => {
    if (!isLoadingRef.current) return;
    if (typeof apis.current.cancel === 'function') {
      isCancelRef.current = true;
      apis.current.cancel();
      setIsLoadingDispose(false);
      clearRetryTimer();
      setCanceled({ date: new Date() });
    }
  };

  const setIsLoadingDispose = (v: boolean) => {
    isLoadingRef.current = v;
    if (v) {
      // true 는 즉시 반영
      setIsLoading(v);
    } else {
      // false 이면 loadingEndedBounceTime 에 따라 디바운스 처리
      if (loadingEndedBounceTime > 0) {
        setIsLoadingDebounce.call();
      } else {
        setIsLoading(v);
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (enabledAutoFetch) fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, autoFetchDependencies ?? []);

  return {
    isFetched,
    isLoading,
    isLoadingRef,
    isLoadingOrMounting,
    isMounted,
    error,
    result,
    canceled,
    fetch,
    cancel,
  };
}
