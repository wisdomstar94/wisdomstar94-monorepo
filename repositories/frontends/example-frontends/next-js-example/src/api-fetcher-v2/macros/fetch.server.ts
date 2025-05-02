'use server';

import { cookies, headers } from 'next/headers';
import setCookie from 'set-cookie-parser';
import { FetchProps } from '../types';

export async function fetchServer(props: FetchProps) {
  const { url, requestInit } = props;
  const cookie = await cookies();
  const header = await headers();

  const ip = '...';
  const userAgent = header.get('user-agent');
  const referer = header.get('referer');
  const host = header.get('host');

  // 공통 헤더 추가
  const reqHeaders = new Headers(requestInit.headers);
  if (typeof ip === 'string') {
    reqHeaders.append('x-forwarded-for', ip);
  }
  if (typeof userAgent === 'string') {
    reqHeaders.append('user-agent', userAgent);
  }
  if (typeof referer === 'string') {
    reqHeaders.append('referer', referer);
  }
  reqHeaders.append('Content-Type', 'application/json');
  reqHeaders.append('Cookie', cookie.toString()); // 클라이언트로부터 받은 쿠키를 헤더에 추가
  requestInit.headers = reqHeaders;

  // fetch 호출
  let res: Response | undefined = undefined;
  try {
    res = await fetch(url, requestInit);
  } catch (e) {
    throw e;
  }
  if (res === undefined) {
    throw new Error('fetch 실패');
  }

  const resClone = res.clone();

  // 응답 받은 헤더를 클라이언트로 전달
  // const resHeaders = resClone.headers;
  // resHeaders.forEach((value, key) => {
  //   if (key.toLowerCase() === 'set-cookie') {
  //     return;
  //   }
  //   header.set(key, value);
  // });

  // 응답 받은 쿠키를 클라이언트로 전달
  const resCookies = resClone.headers.getSetCookie();
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

  return res;
}
