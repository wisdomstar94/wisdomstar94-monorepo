import { fetchV2 } from '@wisdomstar94/vanilla-js-util';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const result = await fetchV2('http://127.0.0.1:3010/api/test/test1', {
    eConnRefusedRetryOptions: {
      enable: true,
      interval: 1500,
      maxRetryCount: 10,
      called(retriedCount) {
        console.log('##called..retriedCount', retriedCount);
      },
    },
  });
  console.log('@@result', result);
  return <>{children}</>;
}
