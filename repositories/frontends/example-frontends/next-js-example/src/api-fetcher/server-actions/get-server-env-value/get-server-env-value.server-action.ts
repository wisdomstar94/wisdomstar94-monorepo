'use server';

import { createServerActionFn } from '@/api-fetcher';
import { getServerEnvValueServer } from './get-server-env-value.server';

export const getServerEnvValueServerAction = createServerActionFn({
  fn: getServerEnvValueServer,
});
