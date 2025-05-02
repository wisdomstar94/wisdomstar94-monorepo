import { NextRequest, NextResponse } from 'next/server';
import { getJwtExp, getSetCookieListFromFetchResponse } from '../_macros';
import { JwtProcessResult, RefreshInfo } from '..';

/**
 * @description accessToken 과 refreshToken 모두 존재하는 경우에 대한 처리를 담당하는 함수
 */
export async function processAccessTokenOnRefreshTokenOn(props: {
  request: NextRequest;
  response?: NextResponse;
  accessToken: string;
  refreshInfo: RefreshInfo;
}): Promise<JwtProcessResult> {
  const { request, accessToken, refreshInfo } = props;
  const { refreshBelowTime, refreshApiUrl, refreshApiMethod } = refreshInfo;
  const exp = getJwtExp({ jwtToken: accessToken });

  if (exp - Date.now() >= refreshBelowTime) {
    return {
      result: 'jwt-valid',
    };
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
      return {
        result: 'refresh-fail',
      };
    }
    // 갱신 성공
    return {
      result: 'refresh-done',
      setCookies: getSetCookieListFromFetchResponse({ response: res }),
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return {
      result: 'refresh-fail',
    };
  }
}
