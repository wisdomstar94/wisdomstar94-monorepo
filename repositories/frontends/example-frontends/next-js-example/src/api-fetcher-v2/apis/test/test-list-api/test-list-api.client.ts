'use client';

import { testListApiOverview, TestListApiFetcherFn } from './test-list-api.overview';
import { apiFetcherClient } from '@/api-fetcher-v2';

export const testListApiClient: TestListApiFetcherFn = async ({ payload }) => {
  const { url, method } = testListApiOverview({ payload });
  return await apiFetcherClient({
    url,
    method,
    payload,
  });
};
