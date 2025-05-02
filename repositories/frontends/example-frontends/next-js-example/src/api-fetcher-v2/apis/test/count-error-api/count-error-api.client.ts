'use client';

import { countErrorApiOverview, CountErrorApiFetcherFn } from './count-error-api.overview';
import { apiFetcherClient } from '@/api-fetcher-v2';

export const countErrorApiClient: CountErrorApiFetcherFn = async ({ payload }) => {
  const { url, method } = countErrorApiOverview({ payload });
  return await apiFetcherClient({
    url,
    method,
    payload,
  });
};
