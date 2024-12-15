import { fetchInstance } from '@wisdomstar94/vanilla-js-util';
import { cookies } from 'next/headers';

// next.js server side 용 (server component, server action 에서 사용)
export async function createFetchInstance(url: string, requestInit: RequestInit) {
  const cookie = await cookies();

  return fetchInstance({
    url,
    requestInit,
    onRequestBefore: async () => {
      return {
        headers: {
          Authorization: `Bearer ${cookie.get('access_token')}`,
          Cookie: cookie.toString(),
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
}
