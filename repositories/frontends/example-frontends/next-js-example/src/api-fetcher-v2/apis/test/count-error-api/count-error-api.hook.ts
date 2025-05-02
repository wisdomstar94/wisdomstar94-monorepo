'use client';

import { useAsyncCaller } from '@wisdomstar94/react-api';

import { countErrorApiServerAction } from './count-error-api.server-action';
// import { countErrorApiClient } from './count-error-api.client';

import { asyncCallerOnSuccessErrorCase, useAsyncCallerGlobalErrorHandler } from '@/api-fetcher-v2';

type AsyncFnType = typeof countErrorApiServerAction;
// type AsyncFnType = typeof countErrorApiClient;

type Params = {
  onSuccess?: Parameters<typeof useAsyncCaller<AsyncFnType>>[0]['onSuccess'];
  onError?: Parameters<typeof useAsyncCaller<AsyncFnType>>[0]['onError'];
};

export function useCountErrorApi(params?: Params): ReturnType<typeof useAsyncCaller<AsyncFnType>> {
  const { onError } = useAsyncCallerGlobalErrorHandler();
  return useAsyncCaller({
    asyncFn: countErrorApiServerAction,
    // asyncFn: countErrorApiClient,

    onSuccessErrorCase: (res) => asyncCallerOnSuccessErrorCase(res),
    onError(error) {
      onError(error);
      if (typeof params?.onError === 'function') {
        params.onError(error);
      }
    },
    onSuccess: params?.onSuccess,
  });
}
