'use server';

import { toQueryString, type ApiPayloadRequired, type FetcherFn } from '@/api-fetcher';
import { cookies, headers } from 'next/headers';
import setCookie from 'set-cookie-parser';

export const fetcherServer: FetcherFn = async <T extends ApiPayloadRequired>(params: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  payload: T;
}) => {
  const { url, method, payload } = params;

  // before action...
  // ...

  const queryString = payload.query !== undefined ? toQueryString(payload.query) : '';
  const result = await fetch(url + queryString, {
    method,
    body: payload.body !== undefined ? JSON.stringify(payload.body) : undefined,
    headers: payload.headers !== undefined ? payload.headers : undefined,
  });

  // after action...
  const header = await headers();
  const nextAction = header.get('next-action') ?? header.get('Next-Action');
  const isServerAction = typeof nextAction === 'string';
  if (isServerAction) {
    // 서버 액션에서 호출한 api 로부터 응답받은 헤더에 있는 쿠키를 클라이언트에 전달하는 코드임.
    // 필요 없을 경우 주석처리 하면 됨.
    const host = header.get('host');
    const cookie = await cookies();
    const resCookies = result.headers.getSetCookie();
    for (const c of resCookies ?? []) {
      const cookieInfo = setCookie.parseString(c);
      const secure = (function () {
        if (host?.startsWith('localhost')) return false;
        if (host?.startsWith('192.')) return false;
        if (host?.startsWith('172.')) return false;
        return cookieInfo.secure;
      })();
      cookie.set(cookieInfo.name, cookieInfo.value, {
        expires: cookieInfo.expires,
        httpOnly: cookieInfo.httpOnly,
        maxAge: cookieInfo.maxAge,
        secure,
        sameSite: cookieInfo.sameSite as true | false | 'lax' | 'strict' | 'none' | undefined,
        domain: cookieInfo.domain,
        path: cookieInfo.path,
      });
    }
  }

  if (result.status >= 400 && result.status < 600) {
    throw result;
  }

  return result;
};
