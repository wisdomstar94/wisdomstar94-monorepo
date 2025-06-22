import { ApiPayloadRequired, IndivisualApiCallerFn } from '../types';

export async function generateIndivisualApiCallerFnResult<T extends ApiPayloadRequired, R>(response: Response) {
  const result: Awaited<ReturnType<IndivisualApiCallerFn<T, R>>> = {
    responseStatus: response.status,
    body: await response.json(),
  };
  return result;
}
