import { createFetchInstance } from '@/fetcher/fetcher';
import { ReactNode } from 'react';
import { cookies } from 'next/headers';

export default async function Layout({ children }: { children: ReactNode }) {
  console.log(`rsc cookies`, cookies().toString());
  const instance = await createFetchInstance(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/userInfo`, {
    method: 'GET',
  });
  const res = await instance.call();
  const body = await res.json();
  console.log('rsc body', body);

  return <>{children}</>;
}
