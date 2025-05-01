import { ReqPayload } from '@/api-fetcher-v2/types';

export type TestListApiReqPayload = ReqPayload<
  // 요청 body
  void,
  // 요청 query
  void,
  // 요청 params
  {
    id?: number;
  },
  // 요청 headers
  void
>;
