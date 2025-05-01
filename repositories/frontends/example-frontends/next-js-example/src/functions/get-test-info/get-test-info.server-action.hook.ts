'use client';

import { useAsyncCaller } from '@wisdomstar94/react-api';
import { getTestInfoServerAction } from './get-test-info.server-action';
import { useAsyncCallerErrorHandler } from '@/hooks/use-async-caller-error-handler.hook';
type ServerActionType = typeof getTestInfoServerAction;
type Params = {
  onSuccess?: Parameters<typeof useAsyncCaller<ServerActionType>>[0]['onSuccess'];
  onError?: Parameters<typeof useAsyncCaller<ServerActionType>>[0]['onError'];
};

export function useGetTestInfoServerAction(params?: Params): ReturnType<typeof useAsyncCaller<ServerActionType>> {
  const { onError } = useAsyncCallerErrorHandler();
  return useAsyncCaller({
    asyncFn: getTestInfoServerAction,
    errorCase: (res) => {
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
