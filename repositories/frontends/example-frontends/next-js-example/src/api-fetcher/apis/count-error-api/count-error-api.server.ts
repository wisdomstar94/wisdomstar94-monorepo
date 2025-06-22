'use server';

import { countErrorApi, fetcherServer } from '@/api-fetcher';

type Params = {
  payload: Parameters<typeof countErrorApi>[0]['payload'];
};

export const countErrorApiServer = async (params: Params) => {
  const { payload } = params;
  return countErrorApi({
    fetcher: fetcherServer,
    payload,
  });
};
