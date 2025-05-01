import { useAsyncCaller } from '@wisdomstar94/react-api';
import { ApiFetcherResultCommon } from '../types';
type ErrorCaseFn = Parameters<typeof useAsyncCaller>[0]['errorCase'];

export const asyncCallerErrorCase: ErrorCaseFn = (res: ApiFetcherResultCommon<unknown>) => {
  if (res.error !== undefined) {
    return {
      isError: true,
      error: res.error,
    };
  }
  return {
    isError: false,
  };
};
