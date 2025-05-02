import { NextRequest } from 'next/server';

export function getCookie(props: { request: NextRequest; name: string }) {
  const { request, name } = props;
  const cookie = request.cookies.get(name);
  return cookie?.value;
}
