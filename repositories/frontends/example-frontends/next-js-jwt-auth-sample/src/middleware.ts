import type { NextRequest } from 'next/server';
import { jwtCookieMiddleware } from '@wisdomstar94/next-utils';

export default async function middleware(request: NextRequest) {
  const res = await jwtCookieMiddleware({
    request,
    isNoAuth(request) {
      const pathname = request.nextUrl.pathname;
      if (pathname.startsWith('/login')) return true;
      if (pathname.startsWith('/_next')) return true;
      if (pathname.startsWith('/favicon')) return true;
      return false;
    },
    cookieNames: {
      accessTokenCookieName: 'accessToken',
      refreshTokenCookieName: 'refreshToken',
    },
    cookieDomain: '*',
    cookieResSecure: () => true,
    logoutRedirectPathname: '/login',
    refreshApiUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
    refreshBelowTime: 1000 * 60,
    // refreshApiRetryOptions: {
    //   retryCount: 10,
    //   retryDelay: 1000,
    // },
    noAuthButLoggedIn: (req, response) => {
      const pathname = request.nextUrl.pathname;
      if (pathname.startsWith('/login')) {
        response.cookies.set('is_logouted', 'true');
      }
    },
    debug: true,
  });
  return res;
}
