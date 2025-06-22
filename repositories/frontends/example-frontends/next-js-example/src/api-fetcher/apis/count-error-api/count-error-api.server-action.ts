'use server';

import { createServerActionFn, countErrorApiServer } from '@/api-fetcher';

export const countErrorApiServerAction = createServerActionFn({
  fn: countErrorApiServer,
});
