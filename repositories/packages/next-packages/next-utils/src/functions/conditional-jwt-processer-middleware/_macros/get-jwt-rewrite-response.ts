import { NextRequest, NextResponse } from 'next/server';
import setCookie from 'set-cookie-parser';
import { getCookieSecure } from './get-cookie-secure';

export function getJwtRewriteResponse(props: { authServerResponse: Response; request: NextRequest }) {
  const { authServerResponse, request } = props;
  const refreshResSetCookies = authServerResponse.headers.getSetCookie();
  const secure = getCookieSecure({ request });
  const res = NextResponse.rewrite(request.url, {
    request,
  });
  for (const c of refreshResSetCookies ?? []) {
    const cookieInfo = setCookie.parseString(c);
    request.cookies.set(cookieInfo.name, cookieInfo.value);
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
