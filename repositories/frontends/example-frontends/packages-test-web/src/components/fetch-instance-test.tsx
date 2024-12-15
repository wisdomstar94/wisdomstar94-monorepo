'use client';

import { useFetcher } from '@/fetcher/use-fetcher';

export function FetchInstanceTest() {
  const fetcher = useFetcher();

  return (
    <>
      <button
        onClick={async () => {
          const instance = fetcher.createFetchInstance('https://cat-fact.herokuapp.com/facts/?a=bbb', { method: 'GET' });
          const result = await instance.call();
          console.log('@result', result);
        }}
      >
        fetch!
      </button>
    </>
  );
}
