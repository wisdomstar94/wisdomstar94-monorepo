import { createFetchInstance } from '@/fetcher/fetcher';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  // const instance = await createFetchInstance('https://cat-fact.herokuapp.com/facts/?a=bbb', { method: 'GET' });
  // const res = await instance.call().catch((err) => err);
  // console.log('@res', res);
  return <>{children}</>;
}
