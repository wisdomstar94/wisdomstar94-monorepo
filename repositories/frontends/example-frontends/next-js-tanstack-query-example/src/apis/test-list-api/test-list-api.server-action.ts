'use server';

import { testListApi } from './test-list-api';

export async function testListApiServerAction(payload: Parameters<typeof testListApi>[0]) {
  return await testListApi(payload);
}
