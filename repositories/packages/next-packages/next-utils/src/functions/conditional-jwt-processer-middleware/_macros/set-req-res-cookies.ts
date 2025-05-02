import type { NextRequest, NextResponse } from 'next/server';
import setCookie from 'set-cookie-parser';

export function setReqResCookies(props: {
  request: NextRequest;
  response: NextResponse;
  setCookies: setCookie.Cookie[];
}) {
  const { request, response, setCookies } = props;
  for (const cookieInfo of setCookies ?? []) {
    request.cookies.set(cookieInfo.name, cookieInfo.value);
    response.cookies.set(cookieInfo.name, cookieInfo.value, {
      expires: cookieInfo.expires,
      httpOnly: cookieInfo.httpOnly,
      maxAge: cookieInfo.maxAge,
      secure: cookieInfo.secure,
      sameSite: cookieInfo.sameSite as
        | true
        | false
        | 'lax'
        | 'strict'
        | 'none'
        | undefined,
      domain: cookieInfo.domain,
      path: cookieInfo.path,
    });
  }
}
