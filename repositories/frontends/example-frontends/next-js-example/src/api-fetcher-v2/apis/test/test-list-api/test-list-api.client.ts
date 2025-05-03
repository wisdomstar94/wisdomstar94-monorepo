'use client';

import { testListApiOverview, TestListApiFetcherClientFn } from './test-list-api.overview';
import { apiFetcherClient } from '@/api-fetcher-v2';

export const testListApiClient: TestListApiFetcherClientFn = async ({ payload, controller }) => {
  const { url, method } = testListApiOverview({ payload });
  return await apiFetcherClient({
    url,
    method,
    payload,
    controller,
  });
};
