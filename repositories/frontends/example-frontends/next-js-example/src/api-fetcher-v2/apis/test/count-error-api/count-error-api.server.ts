'use server';

import { countErrorApiOverview, CountErrorApiFetcherFn } from './count-error-api.overview';
import { apiFetcherServer } from '@/api-fetcher-v2';

export const countErrorApiServer: CountErrorApiFetcherFn = async ({ payload }) => {
  const { url, method } = countErrorApiOverview({ payload });
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
