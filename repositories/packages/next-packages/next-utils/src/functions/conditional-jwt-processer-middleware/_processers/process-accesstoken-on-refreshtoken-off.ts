import { NextRequest, NextResponse } from 'next/server';
import { getJwtExp } from '../_macros';
import { JwtProcessResult, RefreshInfo } from '..';

/**
 * @description accessToken 은 존재하고 refreshToken 은 없는 경우에 대한 처리를 담당하는 함수
 */
export async function processAccessTokenOnRefreshTokenOff(props: {
  request: NextRequest;
  response?: NextResponse;
  accessToken: string;
  refreshInfo: RefreshInfo;
}): Promise<JwtProcessResult> {
  const { accessToken, refreshInfo } = props;
  const { refreshBelowTime } = refreshInfo;
  const exp = getJwtExp({ jwtToken: accessToken });

  if (exp - Date.now() >= refreshBelowTime) {
    return {
      result: 'jwt-valid',
    };
  }

  return {
    result: 'jwt-invalid',
  };
}
