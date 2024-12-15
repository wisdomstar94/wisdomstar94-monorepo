'use client';

import { fetchInstance, onResponseAfterAuth } from '@wisdomstar94/vanilla-js-util';
import { useRouter } from 'next/navigation';

// next.js client side 용 (client component 에서 사용, 훅으로 사용하는 이유는 useState, useEffect 등 react 의 기본 훅을 사용해야 하는 경우가 있을 수 있기 때문)
export function useFetcher() {
  const router = useRouter();

  const createFetchInstance = (url: string, requestInit: RequestInit) => {
    return fetchInstance({
      url,
      requestInit,
      onRequestBefore: async () => {
        // 클라이언트 사이드 단에서 fetch 사용할 때마다 공통으로 반영되어야 할 부분을 여기에 설정합니다. (미들웨어 역할)
        return {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 매 요청마다 클라이언트에 저장되어 있는 http only cookie 들을 요청 헤더에 자동 포함, 백엔드 도메인 주소가 다를 경우 'include' 로 설정 해야 할 수 있음.
        };
      },
      onResponseAfter: async (url, requestInit, res) => {
        return await onResponseAfterAuth({
          // debug: true,
          url,
          refreshApiUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
          requestInit,
          res,
          // retryOptions: {
          //   retryCount: 2,
          //   retryDelay: 1000,
          // },
          onRefreshFailed() {
            router.push('/login');
          },
          isAccessTokenExpired: async (res) => {
            // const body = await res.clone().json();
            // return body.errorCode === '???';
            return res.status === 403;
          },
          onRefreshTokenExipred: function (): void {
            throw new Error('Function not implemented.');
          },
          isRefreshTokenExpired: function (res: Response): Promise<boolean> {
            throw new Error('Function not implemented.');
          },
        });
      },
    });
  };

  return { createFetchInstance };
}
