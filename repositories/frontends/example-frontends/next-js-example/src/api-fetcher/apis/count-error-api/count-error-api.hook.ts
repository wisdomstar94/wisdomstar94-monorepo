'use client';

import { countErrorApi, useAsyncCaller } from '@/api-fetcher';
import { countErrorApiClient } from './count-error-api.client';

export function useCountErrorApi() {
  return useAsyncCaller({
    fn: countErrorApiClient,
  });
}
