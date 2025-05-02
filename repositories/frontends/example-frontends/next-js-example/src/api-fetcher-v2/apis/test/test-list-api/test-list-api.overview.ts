import { ApiFetcherIndivisualFn, ApiFetcherOverviewFn } from '@/api-fetcher-v2';
import { TestListApiReqPayload, TestListItem } from './test-list-api.types';

type LocalReqPayload = TestListApiReqPayload;
type LocalResPayload = TestListItem[];

export type TestListApiFetcherFn = ApiFetcherIndivisualFn<LocalReqPayload, LocalResPayload>;

export const testListApiOverview: ApiFetcherOverviewFn<LocalReqPayload> = ({ payload }) => {
  return {
    url: `https://fake-json-api.mock.beeceptor.com/users${payload.params.id === 0 ? `aaa` : ''}`,
    method: 'GET',
    payload,
  };
};
