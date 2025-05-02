import { ReqPayload } from '@/api-fetcher-v2/types';

export type CountErrorApiReqPayload = ReqPayload<
  // 요청 body
  void,
  // 요청 query
  void,
  // 요청 params
  void,
  // 요청 headers
  {
    'My-Header-Key'?: string;
  }
>;

export type CountErrorResPayload = {
  tag: string;
  path: string;
  timestamp: number;
};
