## conditional-jwt-processer-middleware 

### 사용 예시

```ts
import { NextRequest, NextResponse } from 'next/server';
import {
  conditionalJwtProcesserMiddleware,
  setReqResCookies,
} from '@wisdomstar94/next-utils';

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const { authResultItems } = await conditionalJwtProcesserMiddleware({
    request,
    noJwtCheck: (req) => {
      const pathname = req.nextUrl.pathname;
      if (pathname.startsWith('/_next')) return true;
      if (pathname.startsWith('/favicon')) return true;
      if (pathname.startsWith('/login')) return true;
      return false;
    },
    authInfoItems: [
      {
        cookieNames: {
          accessTokenCookieName: '엑세스 토큰 쿠키명',
          refreshTokenCookieName: '리프레쉬 토큰 쿠키명',
        },
        refreshInfo: {
          refreshApiUrl: `갱신 API URL`,
          refreshApiMethod: 'POST',
          refreshBelowTime: 1000 * 10,
        },
      },
    ],
  });

  const response = NextResponse.rewrite(request.url, {
    request,
  });

  for (const authResultItem of authResultItems ?? []) {
    const {
      // result,
      setCookies,
    } = authResultItem;

    if (setCookies !== undefined) {
      setReqResCookies({
        request,
        response,
        setCookies,
      });
    }
  }

  return response;
}

```