'use client';

import { countErrorApiOverview, CountErrorApiFetcherClientFn } from './count-error-api.overview';
import { apiFetcherClient } from '@/api-fetcher-v2';

export const countErrorApiClient: CountErrorApiFetcherClientFn = async ({ payload, controller }) => {
  const { url, method } = countErrorApiOverview({ payload });
  return await apiFetcherClient({
    url,
    method,
    payload,
    controller,
  });
};
