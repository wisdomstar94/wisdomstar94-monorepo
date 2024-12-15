import { useFetcher } from '@/fetcher/use-fetcher.hook';
import { useApi } from '@wisdomstar94/react-api';
import { useState } from 'react';

export function useLoginApi() {
  const [payload, setPayload] = useState<Record<string, string>>();
  const fetch = useFetcher();

  const api = useApi({
    api: () => {
      const controller = new AbortController();

      return {
        fn: async () => {
          const instance = fetch.createFetchInstance(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
            method: 'POST',
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
    enabled: payload !== undefined,
    autoFetchDependencies: [payload],
  });

  return { payload, setPayload, api };
}
