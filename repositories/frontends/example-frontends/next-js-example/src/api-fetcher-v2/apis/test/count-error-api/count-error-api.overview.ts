import { ApiFetcherIndivisualFn, ApiFetcherOverviewFn } from '@/api-fetcher-v2';
import { CountErrorApiReqPayload, CountErrorResPayload } from './count-error-api.types';

type ApiReqPayload = CountErrorApiReqPayload;
type ApiResPayload = CountErrorResPayload;

export type CountErrorApiFetcherFn = ApiFetcherIndivisualFn<ApiReqPayload, ApiResPayload>;

export const countErrorApiOverview: ApiFetcherOverviewFn<ApiReqPayload> = ({ payload }) => {
  return {
    url: `http://localhost:3010/api/test/count-error`,
    method: 'GET',
    payload,
  };
};
