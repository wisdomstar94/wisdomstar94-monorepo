'use server';

import { apiFetcherServer } from '@/api-fetcher-v2/macros';
import { TestListApiReqPayload } from './test-list-api.types';
import { testListApi } from './test-list-api';

export async function testListApiServer({ payload }: { payload: TestListApiReqPayload }) {
  const { url, method } = testListApi({ payload });
  return await apiFetcherServer({
    url,
    method,
    payload,
  });
}
