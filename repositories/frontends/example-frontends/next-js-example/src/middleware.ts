import { NextRequest, NextResponse } from 'next/server';
import setCookie from 'set-cookie-parser';
import { decode } from 'jsonwebtoken';

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // request header control
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-hello-from-middleware1', 'hello');
  requestHeaders.set('x-hello-from-middleware2', 'world!');
  requestHeaders.set('user-agent', 'New User Agent overriden by middleware!');
  requestHeaders.delete('x-from-client');

  // auth check
  const authCheck = await checkAuth(request, response);
  console.log('@authCheck', authCheck);
  if (authCheck === 'logout') {
    // return NextResponse.redirect('/login');
  } else if (authCheck === 'refresh-failed') {
    // return NextResponse.redirect('/login');
  } else if (authCheck === 'refresh-success-must-rewrite') {
    return NextResponse.rewrite(request.url, response);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

async function checkAuth(
  request: NextRequest,
  response: NextResponse
): Promise<'no-auth' | 'logout' | 'refresh-failed' | 'refresh-success-must-rewrite' | 'auth-verify'> {
  if (request.url.startsWith('/login')) return 'no-auth';
  if (request.url.startsWith('/sign-up')) return 'no-auth';

  const accessTokenCookie = request.cookies.get('accessToken');
  const refreshTokenCookie = request.cookies.get('refreshToken');

  // access token 쿠키도 없고 refresh token 쿠키도 없는 경우 (쿠키의 시간이 만료됬거나 삭제된 경우)
  if (accessTokenCookie === undefined && refreshTokenCookie === undefined) {
    return 'logout';
  }

  // access token 쿠키는 없고(쿠키의 시간이 만료됬거나 삭제된 경우) refresh token 쿠키는 있는 경우
  if (accessTokenCookie === undefined && refreshTokenCookie !== undefined) {
    // 즉시 갱신 시도
    const res = await fetch('http://localhost:3020/test/refreshToken', {
      headers: {
        Cookie: request.cookies.toString(),
      },
    });
    // 갱신 실패
    if (res.status >= 400 && res.status <= 500) {
      return 'refresh-failed';
    }
    // 갱신 성공
    const cookies = res.headers.getSetCookie();
    for (const c of cookies) {
      const cookieInfo = setCookie.parseString(c);
      // cookieInfo.sameSite
      // console.log('middleware 가 api 로부터 받은 쿠기', cookieInfo);
      response.cookies.set(cookieInfo.name, cookieInfo.value, {
        expires: cookieInfo.expires,
        httpOnly: cookieInfo.httpOnly,
        maxAge: cookieInfo.maxAge,
        secure: cookieInfo.secure,
        sameSite: cookieInfo.sameSite as true | false | 'lax' | 'strict' | 'none' | undefined,
        domain: cookieInfo.domain,
        path: cookieInfo.path,
      });
    }
    return 'refresh-success-must-rewrite';
  }

  // access token 쿠키는 있고 refresh token 쿠키는 없는 경우 (쿠키의 시간이 만료됬거나 삭제된 경우)
  if (accessTokenCookie !== undefined && refreshTokenCookie === undefined) {
    // 만료시간 체크
    const accessToken = decode(accessTokenCookie.value);
    if (typeof accessToken === 'string') {
      return 'logout';
    }
    if (accessToken === null) {
      return 'logout';
    }
    if (typeof accessToken.exp !== 'number') {
      return 'logout';
    }
    const exp = accessToken.exp.toString().length === 10 ? Number(accessToken.exp + '000') : accessToken.exp;
    if (exp - Date.now() <= 1000 * 60) {
      return 'logout';
    }
  }

  // access token 쿠키도 있고 refresh token 쿠키도 있는 경우
  if (accessTokenCookie !== undefined && refreshTokenCookie !== undefined) {
    // 만료시간 체크
    const accessToken = decode(accessTokenCookie.value);

    const exp = (function () {
      if (typeof accessToken === 'string' || accessToken === null || typeof accessToken.exp !== 'number') {
        return 0;
      }
      if (accessToken === null) {
        return 0;
      }
      if (typeof accessToken.exp !== 'number') {
        return 0;
      }
      return accessToken.exp.toString().length === 10 ? Number(accessToken.exp + '000') : accessToken.exp;
    })();

    console.log('@exp', exp);

    if (exp - Date.now() <= 1000 * 60) {
      // 즉시 갱신 시도
      const res = await fetch('http://localhost:3020/test/refreshToken', {
        headers: {
          Cookie: request.cookies.toString(),
        },
      });
      // 갱신 실패
      if (res.status >= 400 && res.status <= 500) {
        return 'refresh-failed';
      }
      // 갱신 성공
      const cookies = res.headers.getSetCookie();
      for (const c of cookies) {
        const cookieInfo = setCookie.parseString(c);
        // cookieInfo.sameSite
        // console.log('middleware 가 api 로부터 받은 쿠기', cookieInfo);
        response.cookies.set(cookieInfo.name, cookieInfo.value, {
          expires: cookieInfo.expires,
          httpOnly: cookieInfo.httpOnly,
          maxAge: cookieInfo.maxAge,
          secure: cookieInfo.secure,
          sameSite: cookieInfo.sameSite as true | false | 'lax' | 'strict' | 'none' | undefined,
          domain: cookieInfo.domain,
          path: cookieInfo.path,
        });
      }
      return 'refresh-success-must-rewrite';
    }
  }

  return 'auth-verify';
}
