'use server';

import { testListApiOverview, TestListApiFetcherServerFn } from './test-list-api.overview';
import { apiFetcherServer } from '@/api-fetcher-v2';

export const testListApiServer: TestListApiFetcherServerFn = async ({ payload, controller }) => {
  const { url, method } = testListApiOverview({ payload });
  return await apiFetcherServer({
    url,
    method,
    payload,
    controller,
    // nextOptions: {
    //   cache: 'force-cache',
    //   next: {
    //     tags: ['...']
    //   }
    // }
  });
};
