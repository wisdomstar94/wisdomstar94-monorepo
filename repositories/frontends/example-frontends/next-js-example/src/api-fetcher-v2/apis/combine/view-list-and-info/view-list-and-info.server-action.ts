'use server';

import { wrapServerActionReturn } from '@/macros';
import { viewListAndInfoServer } from './view-list-and-info.server';

export async function viewListAndInfoServerAction(...args: Parameters<typeof viewListAndInfoServer>) {
  return (await wrapServerActionReturn(viewListAndInfoServer))(...args);
}
