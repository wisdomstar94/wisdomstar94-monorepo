import * as jose from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import setCookie from 'set-cookie-parser';

export type JwtCookieMiddlewareCookieNames = {
  accessTokenCookieName: string;
  refreshTokenCookieName: string;
};

export type JwtCookieMiddlewareProps<T extends NextRequest, K extends NextResponse> = {
  request: T;
  response?: K;
  isNoAuth: (request: NextRequest) => boolean;
  cookieNames: JwtCookieMiddlewareCookieNames;
  cookieDomain: string;
  cookieResSecure: () => boolean;
  // deleteAtTargetCookieDomains: string[];
  refreshBelowTime: number;
  refreshApiUrl: string;
  refreshApiMethod?: 'GET' | 'POST';
  logoutRedirectPathname: string;
  debug?: boolean;
  noAuthButLoggedIn: (request: NextRequest, response: NextResponse) => void;
  authAndLoggedIn?: (request: NextRequest, response: NextResponse) => void;
};

export async function jwtCookieMiddleware<T extends NextRequest, K extends NextResponse>(
  props: JwtCookieMiddlewareProps<T, K>
) {
  const {
    request,
    response,
    isNoAuth,
    logoutRedirectPathname,
    cookieNames,
    debug,
    noAuthButLoggedIn,
    authAndLoggedIn,
    cookieDomain,
    cookieResSecure,
  } = props;

  if (debug === true) {
    console.log('\n\n');
    console.log('[jwtCookieMiddleware] 시작');
    console.log('[jwtCookieMiddleware] pathname =', request.nextUrl.pathname);
  }

  if (isNoAuth(request)) {
    if (debug === true) console.log('[jwtCookieMiddleware] [no-auth] 시작');
    const res = NextResponse.next(response);
    const checkAuthResult = await checkAuth(request, { ...props, isNoAuth: () => false });
    const { result } = checkAuthResult;
    if (result === 'refresh-failed' || result == 'logout') {
      return res;
    }
    const myResponse = getResponseByResult({
      checkAuthResult,
      cookieNames,
      cookieDomain,
      logoutRedirectPathname,
      request,
      response: res,
      cookieResSecure,
    });
    if (myResponse !== undefined) {
      if (result === 'auth-verify' || result === 'refresh-success-must-rewrite') {
        noAuthButLoggedIn(request, myResponse);
      }
      return myResponse;
    }
    if (result === 'auth-verify' || result === 'refresh-success-must-rewrite') {
      noAuthButLoggedIn(request, res);
    }
    return res;
  }

  const checkAuthResult = await checkAuth(request, props);

  const myResponse = getResponseByResult({
    checkAuthResult,
    cookieNames,
    cookieDomain,
    logoutRedirectPathname,
    request,
    response,
    cookieResSecure,
  });
  if (myResponse !== undefined) {
    return myResponse;
  }

  const r = NextResponse.next(response);
  if (typeof authAndLoggedIn === 'function') {
    authAndLoggedIn(request, r);
  }
  return r;
}

type GetResponseByResultProps<T extends NextRequest, K extends NextResponse> = {
  checkAuthResult: CheckAuthReturnParams;
  request: T;
  response?: K;
  logoutRedirectPathname: string;
  cookieNames: JwtCookieMiddlewareCookieNames;
  cookieDomain: string;
  cookieResSecure: () => boolean;
};

function getResponseByResult<T extends NextRequest, K extends NextResponse>(props: GetResponseByResultProps<T, K>) {
  const { checkAuthResult, request, response, logoutRedirectPathname, cookieNames, cookieDomain, cookieResSecure } =
    props;
  const { result, responseCookies } = checkAuthResult;

  if (result === 'logout') {
    if (!request.nextUrl.pathname.startsWith(logoutRedirectPathname)) {
      const res = NextResponse.redirect(new URL(logoutRedirectPathname, request.url), response);

      const secure = cookieResSecure();
      res.cookies.delete({
        name: cookieNames.accessTokenCookieName,
        httpOnly: true,
        secure,
        domain: cookieDomain,
      });
      res.cookies.delete({
        name: cookieNames.refreshTokenCookieName,
        httpOnly: true,
        secure,
        domain: cookieDomain,
      });

      return res;
    } else {
      const res = NextResponse.next(response);
      const secure = cookieResSecure();
      res.cookies.delete({
        name: cookieNames.accessTokenCookieName,
        httpOnly: true,
        secure,
        domain: cookieDomain,
      });
      res.cookies.delete({
        name: cookieNames.refreshTokenCookieName,
        httpOnly: true,
        secure,
        domain: cookieDomain,
      });

      return res;
    }
  } else if (result === 'refresh-failed') {
    if (!request.nextUrl.pathname.startsWith(logoutRedirectPathname)) {
      const res = NextResponse.redirect(new URL(logoutRedirectPathname, request.url), response);
      const secure = cookieResSecure();
      res.cookies.delete({
        name: cookieNames.accessTokenCookieName,
        httpOnly: true,
        secure,
        domain: cookieDomain,
      });
      res.cookies.delete({
        name: cookieNames.refreshTokenCookieName,
        httpOnly: true,
        secure,
        domain: cookieDomain,
      });

      return res;
    } else {
      const res = NextResponse.next(response);
      const secure = cookieResSecure();
      res.cookies.delete({
        name: cookieNames.accessTokenCookieName,
        httpOnly: true,
        secure,
        domain: cookieDomain,
      });
      res.cookies.delete({
        name: cookieNames.refreshTokenCookieName,
        httpOnly: true,
        secure,
        domain: cookieDomain,
      });

      return res;
    }
  } else if (result === 'refresh-success-must-rewrite') {
    const res = NextResponse.rewrite(request.url, {
      request,
    });
    // const res = NextResponse.next(response);
    // 서버 사이드에서 받은 쿠키를 클라이언트에 전달하는 과정
    for (const c of responseCookies ?? []) {
      const cookieInfo = setCookie.parseString(c);
      const secure = cookieResSecure();
      res.cookies.set(cookieInfo.name, cookieInfo.value, {
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
}

type CheckAuthReturnParams = {
  result: 'no-auth' | 'logout' | 'refresh-failed' | 'refresh-success-must-rewrite' | 'auth-verify';
  responseCookies?: string[];
};

async function checkAuth<T extends NextRequest, K extends NextResponse>(
  request: NextRequest,
  props: JwtCookieMiddlewareProps<T, K>
): Promise<CheckAuthReturnParams> {
  const { cookieNames, refreshBelowTime, refreshApiUrl, refreshApiMethod, debug, isNoAuth } = props;
  if (debug === true) {
    console.log('[jwtCookieMiddleware] [checkAuth] 시작');
  }

  const pathname = request.nextUrl.pathname;
  if (debug === true) {
    console.log('[jwtCookieMiddleware] [checkAuth] pathname =', pathname);
  }
  // console.log('@pathname', pathname);

  // 아래 패턴에 해당하는 url 은 인증을 체크하지 않음.
  if (pathname.startsWith('/_next')) return { result: 'no-auth' };
  if (pathname.startsWith('/favicon')) return { result: 'no-auth' };
  if (isNoAuth(request)) return { result: 'no-auth' };

  // 인증 체크 시작
  if (debug === true) {
    console.log('[jwtCookieMiddleware] [checkAuth] 인증 체크 시작');
  }
  const accessTokenCookie = request.cookies.get(cookieNames.accessTokenCookieName);
  const refreshTokenCookie = request.cookies.get(cookieNames.refreshTokenCookieName);

  // access toekn (X), refresh token (X)
  // access token 쿠키도 없고 refresh token 쿠키도 없는 경우 (쿠키의 시간이 만료됬거나 삭제된 경우)
  if (accessTokenCookie === undefined && refreshTokenCookie === undefined) {
    if (debug === true) {
      console.log('[jwtCookieMiddleware] [checkAuth] access token 쿠키도 없고 refresh token 쿠키도 없음..');
    }
    return { result: 'logout' };
  }

  // access toekn (X), refresh token (O)
  // access token 쿠키는 없고(쿠키의 시간이 만료됬거나 삭제된 경우) refresh token 쿠키는 있는 경우
  if (accessTokenCookie === undefined && refreshTokenCookie !== undefined) {
    if (debug === true) {
      console.log('[jwtCookieMiddleware] [checkAuth] access token 쿠키가 없고 refresh token 쿠키는 있음..');
      console.log('[jwtCookieMiddleware] [checkAuth] @ X O 갱신 시도');
    }

    try {
      // 즉시 갱신 시도
      const res = await fetch(refreshApiUrl, {
        method: refreshApiMethod ?? 'POST',
        headers: {
          Cookie: request.cookies.toString(),
        },
      });
      // 갱신 실패
      if (res.status >= 400 && res.status <= 600) {
        if (debug === true) {
          console.log('[jwtCookieMiddleware] [checkAuth] @ X O 갱신 실패.. res.json()', await res.json());
        }
        return { result: 'refresh-failed' };
      }
      // 갱신 성공
      if (debug === true) console.log('[jwtCookieMiddleware] [checkAuth] @ X O 갱신 성공');
      const refreshResCookies = res.headers.getSetCookie();

      if (debug === true) console.log('[jwtCookieMiddleware] [checkAuth] 갱신 api 로 부터 응답헤더에 받은 쿠키 정보들');
      for (const c of refreshResCookies) {
        const cookieInfo = setCookie.parseString(c);
        if (debug === true) {
          console.log('[jwtCookieMiddleware] [checkAuth] cookieInfo', cookieInfo);
        }
        request.cookies.set(cookieInfo.name, cookieInfo.value);
      }
      return {
        result: 'refresh-success-must-rewrite',
        responseCookies: refreshResCookies,
      };
    } catch (e) {
      if (debug === true) {
        console.error('[jwtCookieMiddleware] [checkAuth] @ X O 갱신 시도 중 try.. catch 에러 발생', e);
      }
      if (e instanceof Error) {
        if (debug === true) {
          console.error('[jwtCookieMiddleware] [checkAuth] error.name', e.name);
          console.error('[jwtCookieMiddleware] [checkAuth] error.message', e.message);
          console.error('[jwtCookieMiddleware] [checkAuth] error.cause', e.cause);
        }
      }
      return { result: 'refresh-failed' };
    }
  }

  // access toekn (O), refresh token (X)
  // access token 쿠키는 있고 refresh token 쿠키는 없는 경우 (쿠키의 시간이 만료됬거나 삭제된 경우)
  if (accessTokenCookie !== undefined && refreshTokenCookie === undefined) {
    if (debug === true) {
      console.log('[jwtCookieMiddleware] [checkAuth] access token 쿠키는 있고 refresh token 쿠키는 없음..');
    }
    // 만료시간 체크
    const accessToken = jose.decodeJwt(accessTokenCookie.value);
    if (typeof accessToken === 'string') {
      if (debug === true) {
        console.error('[jwtCookieMiddleware] [checkAuth] access token 을 decode 했는데 객체가 아닌 문자열이 나옴');
      }
      return { result: 'logout' };
    }
    if (accessToken === null) {
      if (debug === true) {
        console.error('[jwtCookieMiddleware] [checkAuth] access token 을 decode 했는데 null 이 나옴');
      }
      return { result: 'logout' };
    }
    if (typeof accessToken.exp !== 'number') {
      if (debug === true) {
        console.error('[jwtCookieMiddleware] [checkAuth] decode 한 결과에서 exp 값이 숫자가 아님');
      }
      return { result: 'logout' };
    }
    const exp = accessToken.exp.toString().length === 10 ? Number(accessToken.exp + '000') : accessToken.exp;
    if (exp - Date.now() <= 1000 * 60) {
      if (debug === true) {
        console.log('[jwtCookieMiddleware] [checkAuth] 만료까지 60초 이하 남음');
      }
      return { result: 'logout' };
    }
  }

  // access toekn (O), refresh token (O)
  // access token 쿠키도 있고 refresh token 쿠키도 있는 경우
  if (accessTokenCookie !== undefined && refreshTokenCookie !== undefined) {
    if (debug === true) {
      console.log('[jwtCookieMiddleware] [checkAuth] access token 쿠키가 있고 refresh token 쿠키도 있음');
    }

    // 만료시간 체크
    const accessToken = jose.decodeJwt(accessTokenCookie.value);
    const exp = getExp(accessToken);

    // access token 만료까지 특정 밀리세컨드 이하 남았을 경우
    if (exp - Date.now() <= refreshBelowTime) {
      if (debug === true) {
        console.log('[jwtCookieMiddleware] [checkAuth] O O 갱신 시도');
      }

      // 갱신 시도
      try {
        const res = await fetch(refreshApiUrl, {
          method: refreshApiMethod ?? 'POST',
          headers: {
            Cookie: request.cookies.toString(),
          },
        });
        // 갱신 실패
        if (res.status >= 400 && res.status <= 600) {
          if (debug === true) {
            console.log('[jwtCookieMiddleware] [checkAuth] O O 갱신 실패.. res.json()', await res.json());
          }
          return { result: 'refresh-failed' };
        }
        // 갱신 성공
        if (debug === true) {
          console.log('[jwtCookieMiddleware] [checkAuth] O O 갱신 성공');
        }
        const refreshResCookies = res.headers.getSetCookie();

        if (debug === true)
          console.log('[jwtCookieMiddleware] [checkAuth] 갱신 api 로 부터 응답헤더에 받은 쿠키 정보들');
        for (const c of refreshResCookies) {
          const cookieInfo = setCookie.parseString(c);
          if (debug === true) {
            console.log('[jwtCookieMiddleware] [checkAuth] cookieInfo', cookieInfo);
          }
          request.cookies.set(cookieInfo.name, cookieInfo.value);
        }
        if (debug === true) {
          console.log('[jwtCookieMiddleware] [checkAuth] refresh-success-must-rewrite');
        }
        return {
          result: 'refresh-success-must-rewrite',
          responseCookies: refreshResCookies,
        };
      } catch (e) {
        if (debug === true) {
          console.error('[jwtCookieMiddleware] [checkAuth] @ O O 갱신 시도 중 try.. catch 에러 발생', e);
        }
        if (e instanceof Error) {
          if (debug === true) {
            console.error('[jwtCookieMiddleware] [checkAuth] error.name', e.name);
            console.error('[jwtCookieMiddleware] [checkAuth] error.message', e.message);
            console.error('[jwtCookieMiddleware] [checkAuth] error.cause', e.cause);
          }
        }
        return { result: 'refresh-failed' };
      }
    }
  }

  if (debug === true) {
    console.log('[jwtCookieMiddleware] [checkAuth] auth-verify');
  }
  return { result: 'auth-verify' };
}

function getExp(jwt: jose.JWTPayload): number {
  if (typeof jwt === 'string' || jwt === null || typeof jwt.exp !== 'number') {
    return 0;
  }
  if (jwt === null) {
    return 0;
  }
  if (typeof jwt.exp !== 'number') {
    return 0;
  }
  return jwt.exp.toString().length === 10 ? Number(jwt.exp + '000') : jwt.exp;
}
