import { NextResponse } from 'next/server';
import { getCookie, isExistValue } from './_macros';
import {
  processAccessTokenOffRefreshTokenOff,
  processAccessTokenOffRefreshTokenOn,
  processAccessTokenOnRefreshTokenOff,
  processAccessTokenOnRefreshTokenOn,
} from './_processers';
import { AuthResultItem, ConditionalJwtProcesserMiddlewareProps } from './_types';

export async function conditionalJwtProcesserMiddleware(props: ConditionalJwtProcesserMiddlewareProps) {
  const { request, response, authInfoItems, noJwtCheck } = props;
  const pathname = request.nextUrl.pathname;

  if (noJwtCheck(request)) {
    return {
      result: 'no-auth',
      pathname,
      getResponse: () => {
        if (isExistValue(response)) return response;
        return NextResponse.next({ request });
      },
    };
  }

  const authResultItems: AuthResultItem[] = [];

  for (const authInfoItem of authInfoItems) {
    const { cookieNames, refreshInfo } = authInfoItem;
    const accessToken = getCookie({ request, name: cookieNames.accessTokenCookieName });
    const refreshToken = getCookie({ request, name: cookieNames.refreshTokenCookieName });

    const { result, setCookies } = await (async () => {
      if (!isExistValue(accessToken) && !isExistValue(refreshToken)) {
        // accessToken 도 없고 refreshToken 도 없는 경우
        return processAccessTokenOffRefreshTokenOff();
      } else if (isExistValue(accessToken) && !isExistValue(refreshToken)) {
        // accessToken 은 존재하고 refreshToken 은 없는 경우
        return await processAccessTokenOnRefreshTokenOff({
          request,
          response,
          accessToken,
          refreshInfo,
        });
      } else if (!isExistValue(accessToken) && isExistValue(refreshToken)) {
        // accessToken 은 없고 refreshToken 은 존재하는 경우
        return await processAccessTokenOffRefreshTokenOn({
          request,
          refreshInfo,
        });
      } else {
        // accessToken 과 refreshToken 모두 존재하는 경우
        return await processAccessTokenOnRefreshTokenOn({
          request,
          response,
          accessToken: accessToken ?? '',
          refreshInfo,
        });
      }
    })();

    authResultItems.push({
      result,
      setCookies,
    });
  }

  return {
    pathname,
    authResultItems,
  };
}
