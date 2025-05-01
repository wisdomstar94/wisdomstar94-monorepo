'use server';

import { wrapServerActionReturn } from '@/macros';
import { getTestInfo } from './get-test-info';

export async function getTestInfoServerAction(...args: Parameters<typeof getTestInfo>) {
  return (await wrapServerActionReturn(getTestInfo))(...args);
}
