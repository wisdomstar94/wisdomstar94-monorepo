import { useFetcher } from '@/fetcher/use-fetcher';
import { useApi } from '@wisdomstar94/react-api';
import { useState } from 'react';

export function useSampleListApi() {
  const [payload, setPayload] = useState();
  const fetch = useFetcher();

  const api = useApi({
    api: () => {
      const controller = new AbortController();

      return {
        fn: async () => {
          const instance = fetch.createFetchInstance('https://cat-fact.herokuapp.com/facts/?a=bbb', {
            signal: controller.signal,
          });
          return instance.call();
        },
        cancel: () => {
          controller.abort();
        },
      };
    },
    enabledAutoFetch: true,
    autoFetchDependencies: [],
  });

  return { payload, setPayload, api };
}
