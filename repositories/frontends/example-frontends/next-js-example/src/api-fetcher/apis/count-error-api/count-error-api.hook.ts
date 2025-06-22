'use client';

import { countErrorApi, useAsyncCaller } from '@/api-fetcher';
// import { countErrorApiClient } from './count-error-api.client';
import { countErrorApiServerAction } from './count-error-api.server-action';

export function useCountErrorApi() {
  return useAsyncCaller({
    // fn: countErrorApiClient,
    fn: countErrorApiServerAction,
  });
}
