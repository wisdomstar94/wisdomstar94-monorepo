import { fetchV2 } from '@wisdomstar94/vanilla-js-util';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const result = await fetchV2('http://localhost:3010/api/test/test1', {
    eConnRefusedRetryOptions: {
      enable: true,
      interval: 1500,
      maxRetryCount: 5,
      called(retriedCount) {
        console.log('##called..retriedCount', retriedCount);
      },
    },
  });
  console.log('@@result', result);
  return <>{children}</>;
}
