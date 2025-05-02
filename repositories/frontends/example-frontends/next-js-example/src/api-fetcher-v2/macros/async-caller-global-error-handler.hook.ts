'use client';

import { isApiFetcherResultCommon } from '@/api-fetcher-v2';

export function useAsyncCallerGlobalErrorHandler() {
  function onError(error: unknown) {
    if (isApiFetcherResultCommon(error)) {
      console.log('@useAsyncCallerGlobalErrorHandler.error', error);
    } else {
      console.log('@what');
    }
  }

  return {
    onError,
  };
}
