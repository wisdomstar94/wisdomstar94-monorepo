'use client';

import { useLoginApi } from '@/hooks/api/use-login-api.hook';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const loginApi = useLoginApi();

  useEffect(() => {
    if (loginApi.api.result === undefined) return;
    router.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginApi.api.result]);

  return (
    <>
      <button
        onClick={() => {
          loginApi.setPayload({});
        }}
      >
        login
      </button>
    </>
  );
}
