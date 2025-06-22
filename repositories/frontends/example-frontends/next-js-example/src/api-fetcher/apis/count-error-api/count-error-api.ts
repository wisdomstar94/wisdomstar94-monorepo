import type { IndivisualApiCallerFn, ReqPayload } from '@/api-fetcher';
import { generateIndivisualApiCallerFnResult } from '@/api-fetcher';

export type CountErrorApiReqPayload = ReqPayload<
  void,
  void,
  void,
  {
    'My-Header-Key'?: string;
  }
>;

export type CountErrorApiResPayload = {
  tag: string;
  path: string;
  timestamp: number;
};

export const countErrorApi: IndivisualApiCallerFn<CountErrorApiReqPayload, CountErrorApiResPayload> = async ({
  fetcher,
  payload,
}) => {
  const response = await fetcher({
    url: `http://localhost:3010/api/test/count-error`,
    method: 'GET',
    payload,
  });
  return generateIndivisualApiCallerFnResult(response);
};
