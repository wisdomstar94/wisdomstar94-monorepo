import { fetchInstance } from '@wisdomstar94/vanilla-js-util';

// next.js server side 용 (server component, server action 에서 사용)
export async function createFetchInstance(url: string, requestInit: RequestInit) {
  const { cookies } = await import('next/headers'); // 클라이언트가 헤더에 포함시킨 쿠키들을 읽어옴.

  return fetchInstance({
    url,
    requestInit,
    onRequestBefore: async () => {
      // 서버 사이드 단에서 fetch 사용할 때마다 공통으로 반영되어야 할 부분을 여기에 설정합니다. (미들웨어 역할)
      return {
        headers: {
          // Authorization: `Bearer ${cookie.get('access_token')}`,
          'Content-Type': 'application/json',
          Cookie: cookies().toString(),
        },
      };
    },
    onResponseAfter: async (url, requestInit, res) => {
      const body = await res.clone().json();

      // 에러 응답인가?
      if (res.status >= 400 && res.status <= 500) {
        throw body;
      }

      return { type: 'pass' as const };
    },
  });
}
