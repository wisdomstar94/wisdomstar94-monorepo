'use client';

import { countErrorApi, fetcherClient } from '@/api-fetcher';

type Params = {
  payload: Parameters<typeof countErrorApi>[0]['payload'];
};

export const countErrorApiClient = async (params: Params) => {
  const { payload } = params;
  return countErrorApi({
    fetcher: fetcherClient,
    payload,
  });
};
