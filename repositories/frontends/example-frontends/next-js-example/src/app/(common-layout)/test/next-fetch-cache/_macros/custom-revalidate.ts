'use server';

import { revalidateTag } from 'next/cache';

export async function customRevalidate(tags: string[]) {
  for (const tag of tags) {
    revalidateTag(tag);
  }
}
