'use server';

import { fetchInstance } from '@wisdomstar94/vanilla-js-util';
import { cookies } from 'next/headers';
import { v7 } from 'uuid';

// next.js server side 용 (server component, server action 에서 사용)
export async function createFetchInstance(url: string, requestInit: RequestInit) {
  // const { cookies } = await import('next/headers'); // 클라이언트가 헤더에 포함시킨 쿠키들을 읽어옴.
  const cookie = await cookies();
  const uuid = v7();

  return fetchInstance({
    url,
    requestInit,
    onRequestBefore: async () => {
      console.log(`[${uuid}] [ api 호출 시도 ]`);
      console.log(`[${uuid}] -- request url`, url);
      console.log(`[${uuid}] -- request method`, requestInit.method);
      console.log(`[${uuid}] -- request body`, requestInit.body);
      // 서버 사이드 단에서 fetch 사용할 때마다 공통으로 반영되어야 할 부분을 여기에 설정합니다. (미들웨어 역할)
      return {
        headers: {
          // Authorization: `Bearer ${cookie.get('access_token')}`,
          'Content-Type': 'application/json',
          Cookie: cookie.toString(),
        },
      };
    },
    onResponseAfter: async (url, requestInit, res) => {
      console.log(`[${uuid}] [ api 호출 결과 ]`);

      console.log(`[${uuid}] -- response status`, res.status);
      try {
        console.log(`[${uuid}] -- response body`, await res.clone().json());
      } catch (e) {
        console.log(`[${uuid}] -- response body`, 'json 형식이 아님.');
      }

      let body: unknown = undefined;
      try {
        body = await res.clone().json();
      } catch (e) {
        if (Date.now() < 0) console.log(e);
        body = { message: '응답 본문이 json 형식이 아닙니다.' };
      }

      // 에러 응답인가?
      if (res.status >= 400 && res.status <= 500) {
        // 원래 여기서도 access token 만료에 대한 처리를 하려고 했으나, set cookie 가 server component 환경에서는 불가하여 middleware 단에서 처리하고 있음.
        throw body;
      }

      return null;
    },
  });
}
