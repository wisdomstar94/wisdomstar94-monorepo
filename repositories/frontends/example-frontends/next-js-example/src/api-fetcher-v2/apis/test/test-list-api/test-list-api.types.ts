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

export type TestListItem = {
  id: number;
  name: string;
  company: string;
  username: string;
  email: string;
  address: string;
  zip: string;
  state: string;
  country: string;
  phone: string;
  photo: string;
};
