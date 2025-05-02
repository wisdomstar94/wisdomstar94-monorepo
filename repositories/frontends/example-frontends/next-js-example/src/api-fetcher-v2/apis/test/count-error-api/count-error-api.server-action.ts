'use server';

import { wrapServerActionReturn } from '@/api-fetcher-v2';
import { countErrorApiServer } from './count-error-api.server';

export async function countErrorApiServerAction(...args: Parameters<typeof countErrorApiServer>) {
  return (await wrapServerActionReturn(countErrorApiServer))(...args);
}
