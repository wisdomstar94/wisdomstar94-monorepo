'use client';

import { useAsyncCaller } from '@wisdomstar94/react-api';
import { viewListAndInfoServerAction } from './view-list-and-info.server-action';
import { asyncCallerOnSuccessErrorCase, useAsyncCallerGlobalErrorHandler } from '@/api-fetcher-v2';

type AsyncFnType = typeof viewListAndInfoServerAction;

type Params = {
  onSuccess?: Parameters<typeof useAsyncCaller<AsyncFnType>>[0]['onSuccess'];
  onError?: Parameters<typeof useAsyncCaller<AsyncFnType>>[0]['onError'];
};

export function useViewListAndInfo(params?: Params): ReturnType<typeof useAsyncCaller<AsyncFnType>> {
  const { onError } = useAsyncCallerGlobalErrorHandler();
  return useAsyncCaller({
    asyncFn: viewListAndInfoServerAction,
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
