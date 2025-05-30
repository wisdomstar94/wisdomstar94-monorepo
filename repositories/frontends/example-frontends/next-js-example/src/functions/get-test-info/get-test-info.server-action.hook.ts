'use client';

import { useAsyncCaller } from '@wisdomstar94/react-api';
import { getTestInfoServerAction } from './get-test-info.server-action';
import { useAsyncCallerGlobalErrorHandler } from '@/api-fetcher-v2';

type ServerActionType = typeof getTestInfoServerAction;
type Params = {
  onSuccess?: Parameters<typeof useAsyncCaller<ServerActionType>>[0]['onSuccess'];
  onError?: Parameters<typeof useAsyncCaller<ServerActionType>>[0]['onError'];
};

export function useGetTestInfoServerAction(params?: Params): ReturnType<typeof useAsyncCaller<ServerActionType>> {
  const { onError } = useAsyncCallerGlobalErrorHandler();
  return useAsyncCaller({
    asyncFn: getTestInfoServerAction,
    onSuccessErrorCase: (res) => {
      if (res.error !== undefined) {
        return {
          isError: true,
          error: res.error,
        };
      }
      return {
        isError: false,
      };
    },
    onError(error) {
      onError(error);
      if (typeof params?.onError === 'function') {
        params.onError(error);
      }
    },
    onSuccess: params?.onSuccess,
  });
}
