'use server';

import { countErrorApiOverview, CountErrorApiFetcherServerFn } from './count-error-api.overview';
import { apiFetcherServer } from '@/api-fetcher-v2';

export const countErrorApiServer: CountErrorApiFetcherServerFn = async ({ payload, controller }) => {
  const { url, method } = countErrorApiOverview({ payload });
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
