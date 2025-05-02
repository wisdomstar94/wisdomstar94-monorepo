import { useAsyncCaller } from '@wisdomstar94/react-api';
import { isApiFetcherResultCommon } from '../types';
type OnSuccessErrorCaseFn = Parameters<typeof useAsyncCaller>[0]['onSuccessErrorCase'];

export const asyncCallerOnSuccessErrorCase: NonNullable<OnSuccessErrorCaseFn> = (res: unknown) => {
  if (typeof res !== 'object' || res === null) {
    return {
      isError: true,
      error: new Error(`res is not object`),
    };
  }

  if (isServerActionResult(res)) {
    if (isApiFetcherResultCommon(res.result)) {
      const { responsePayload } = res.result;
      if (isErrorResponsePayload(responsePayload)) {
        return {
          isError: true,
          error: res.result,
        };
      }
    }
  } else if (isApiFetcherResultCommon(res)) {
    const { responsePayload } = res;
    if (isErrorResponsePayload(responsePayload)) {
      return {
        isError: true,
        error: res,
      };
    }
  }

  // add other check..
  // ..

  return {
    isError: false,
  };
};

function isServerActionResult(v: unknown): v is { result: unknown } {
  if (typeof v !== 'object' || v === null) return false;

  const keys = Object.keys(v);
  const isResultExist = keys.includes('result');

  return isResultExist;
}

function isErrorResponsePayload(v: unknown) {
  return true;
}
