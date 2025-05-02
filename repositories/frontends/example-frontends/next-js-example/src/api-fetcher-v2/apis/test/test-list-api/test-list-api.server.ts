'use server';

import { testListApiOverview, TestListApiFetcherFn } from './test-list-api.overview';
import { apiFetcherServer } from '@/api-fetcher-v2';

export const testListApiServer: TestListApiFetcherFn = async ({ payload }) => {
  const { url, method } = testListApiOverview({ payload });
  return await apiFetcherServer({
    url,
    method,
    payload,
    // nextOptions: {
    //   cache: 'force-cache',
    //   next: {
    //     tags: ['...']
    //   }
    // }
  });
};
