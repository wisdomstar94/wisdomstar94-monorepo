'use client';

import { useAsyncCaller } from '@wisdomstar94/react-api';

import { testListApiServerAction } from './test-list-api.server-action';
// import { testListApiClient } from './test-list-api.client';

import { asyncCallerOnSuccessErrorCase, useAsyncCallerGlobalErrorHandler } from '@/api-fetcher-v2';

type AsyncFnType = typeof testListApiServerAction;
// type AsyncFnType = typeof testListApiClient;

type Params = {
  onSuccess?: Parameters<typeof useAsyncCaller<AsyncFnType>>[0]['onSuccess'];
  onError?: Parameters<typeof useAsyncCaller<AsyncFnType>>[0]['onError'];
};

export function useTestListApi(params?: Params): ReturnType<typeof useAsyncCaller<AsyncFnType>> {
  const { onError } = useAsyncCallerGlobalErrorHandler();
  return useAsyncCaller({
    asyncFn: testListApiServerAction,
    // asyncFn: testListApiClient,

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
