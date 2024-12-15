import { apiFetcher } from '../../macros';
import type { ReqPayload, IndividualApiFn } from '../../';

type SampleReqPayload = ReqPayload<
  // 요청 body
  void,
  // 요청 query
  void,
  // 요청 params
  void
>;

type SampleResponseCommonStruct<T> = T;

type SampleResponsePayload = {
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
}[];

export const testListApi: IndividualApiFn<SampleReqPayload, SampleResponseCommonStruct<SampleResponsePayload>> = async ({
  createFetchInstance,
  payload,
  controller,
  nextOptions,
}) => {
  return await apiFetcher({
    createFetchInstance,
    url: `https://fake-json-api.mock.beeceptor.com/users`,
    method: 'GET',
    payload,
    controller,
    nextOptions,
  });
};
