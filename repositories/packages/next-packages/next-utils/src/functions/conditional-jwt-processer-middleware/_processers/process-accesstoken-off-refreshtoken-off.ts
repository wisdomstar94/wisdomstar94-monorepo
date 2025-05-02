import { JwtProcessResult } from '..';

/**
 * @description accessToken 도 없고 refreshToken 도 없는 경우에 대한 처리를 담당하는 함수
 */
export function processAccessTokenOffRefreshTokenOff(): JwtProcessResult {
  return {
    result: 'jwt-not-exist',
  };
}
