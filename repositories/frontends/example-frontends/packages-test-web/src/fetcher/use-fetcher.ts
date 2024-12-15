'use client';

import { fetchInstance } from '@wisdomstar94/vanilla-js-util';
import Cookies from 'js-cookie';

// next.js client side 용 (client component 에서 사용)
export function useFetcher() {
  const createFetchInstance = (url: string, requestInit: RequestInit) => {
    return fetchInstance({
      url,
      requestInit,
      onRequestBefore: async () => {
        return {
          headers: {
            Authorization: `Bearer ${Cookies.get('access_token')}`,
          },
        };
      },
      onResponseAfter: async (url, requestInit, res) => {
        console.log('@onResponseAfter', { url, requestInit, res });

        if ('access token 만료응답인가?' === Date.now().toString()) {
          // refresh token 으로 access token 갱신 시도
          // cosnt refreshResult = await fetch('...');
          if ('refreshResult 가 에러 응답인가?' === Date.now().toString()) {
            // router.replace('/login');
            throw res;
          }

          // retry..
          return {
            type: 'retry',
            requestParams: {
              url: url + '&timestamp=' + new Date().getTime(),
              requestInit,
            },
          };
        }

        // 에러 응답인가?
        if (res.status >= 400 && res.status <= 500) {
          throw res;
        }
      },
    });
  };

  return { createFetchInstance };
}
