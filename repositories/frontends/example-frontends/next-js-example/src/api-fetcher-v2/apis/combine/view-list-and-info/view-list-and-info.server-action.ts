'use server';

import { wrapServerActionReturn } from '@/api-fetcher-v2';
import { viewListAndInfoServer } from './view-list-and-info.server';

export async function viewListAndInfoServerAction(...args: Parameters<typeof viewListAndInfoServer>) {
  return (await wrapServerActionReturn(viewListAndInfoServer))(...args);
}
