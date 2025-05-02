import { NextRequest, NextResponse } from 'next/server';
import setCookie from 'set-cookie-parser';

export type JwtCheckResult =
  | 'jwt-not-exist'
  | 'refresh-fail'
  | 'jwt-valid'
  | 'jwt-invalid'
  | 'refresh-done'
  | 'no-auth';

export type RefreshInfo = {
  refreshBelowTime: number;
  refreshApiUrl: string;
  refreshApiMethod?: 'GET' | 'POST';
};

export type JwtProcessResult = {
  result: JwtCheckResult;
  setCookies?: setCookie.Cookie[];
};

export type CookieNames = {
  accessTokenCookieName: string;
  refreshTokenCookieName: string;
};

export type AuthInfoItem = {
  cookieNames: CookieNames;
  refreshInfo: RefreshInfo;
};

export type AuthResultItem = {
  result: JwtCheckResult;
  setCookies?: setCookie.Cookie[];
};

export type ConditionalJwtProcesserMiddlewareProps = {
  request: NextRequest;
  response?: NextResponse;
  noJwtCheck: (request: NextRequest) => boolean;
  authInfoItems: AuthInfoItem[];
};
