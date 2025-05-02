import setCookie from 'set-cookie-parser';

export function getSetCookieListFromFetchResponse(props: { response: Response }): setCookie.Cookie[] {
  const { response } = props;
  return response.headers.getSetCookie().map((item) => setCookie.parseString(item));
}
