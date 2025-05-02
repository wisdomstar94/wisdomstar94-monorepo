import { NextRequest } from 'next/server';

export function getCookieSecure(props: { request: NextRequest }) {
  const { request } = props;
  const host = request.headers.get('host');

  if (host?.startsWith('localhost')) {
    return false;
  }
  if (host?.startsWith('192.')) {
    return false;
  }
  if (host?.startsWith('127.')) {
    return false;
  }
  if (host?.startsWith('172.')) {
    return false;
  }
  return true;
}
