'use client';

import { useApiFetcher } from '../../macros/api-fetcher.hook';
// import { testListApi } from './test-list-api';
import { testListApiAction } from './test-list-api.action';

export const useTestListApi = () => {
  return useApiFetcher({
    // apiFn: testListApi,
    apiActionFn: testListApiAction,
  });
};
