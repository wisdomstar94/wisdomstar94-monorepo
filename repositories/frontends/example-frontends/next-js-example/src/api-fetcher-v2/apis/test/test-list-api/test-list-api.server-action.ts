'use server';

import { wrapServerActionReturn } from '@/api-fetcher-v2';
import { testListApiServer } from './test-list-api.server';

export async function testListApiServerAction(...args: Parameters<typeof testListApiServer>) {
  return (await wrapServerActionReturn(testListApiServer))(...args);
}
