'use server';

import { createFetchInstance } from '@/fetcher/fetcher';
import { cookies } from 'next/headers';

export async function userInfo() {
  console.log('server action userInfo called!');
  console.log(`server action cookies`, cookies().toString());
  const instance = await createFetchInstance(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/userInfo`, {
    method: 'GET',
  });
  const res = await instance.call();
  const body = await res.json();
  console.log('server action body', body);
  return body;
}
