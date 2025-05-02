'use server';

import { wrapServerActionReturn } from '@/macros';
import { countErrorApiServer } from './count-error-api.server';

export async function countErrorApiServerAction(...args: Parameters<typeof countErrorApiServer>) {
  return (await wrapServerActionReturn(countErrorApiServer))(...args);
}
