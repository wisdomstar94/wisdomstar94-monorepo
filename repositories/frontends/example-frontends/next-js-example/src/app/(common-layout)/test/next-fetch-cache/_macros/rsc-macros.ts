import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { unstable_cacheTag as cacheTag } from 'next/cache';

export async function getTest1(cookieStore: ReadonlyRequestCookies) {
  'use cache';
  cacheTag('test', 'test1');

  const newHeaders = new Headers();
  newHeaders.append('x-forwared-for', '1.1.1.1');
  newHeaders.append('Cookie', cookieStore.toString());
  newHeaders.append('timestamp', Date.now().toString()); // 헤더의 값이 바뀔 때마다 캐싱이 안되고 새로 요청이 감

  const result = await fetch('http://localhost:3010/api/test/test1', {
    headers: newHeaders,
  });
  const data = await result.json();
  return data;
}

export async function getTest2(cookieStore: ReadonlyRequestCookies) {
  'use cache';
  cacheTag('test', 'test2');

  const newHeaders = new Headers();
  newHeaders.append('x-forwared-for', '1.1.1.1');
  newHeaders.append('Cookie', cookieStore.toString());
  newHeaders.append('timestamp', Date.now().toString()); // 헤더의 값이 바뀔 때마다 캐싱이 안되고 새로 요청이 감

  const result = await fetch('http://localhost:3010/api/test/test2', {
    headers: newHeaders,
  });
  const data = await result.json();
  return data;
}

export async function getTest3(cookieStore: ReadonlyRequestCookies) {
  'use cache';
  cacheTag('test', 'test3');

  const newHeaders = new Headers();
  newHeaders.append('x-forwared-for', '1.1.1.1');
  newHeaders.append('Cookie', cookieStore.toString());
  newHeaders.append('timestamp', Date.now().toString()); // 헤더의 값이 바뀔 때마다 캐싱이 안되고 새로 요청이 감

  const result = await fetch('http://localhost:3010/api/test/test3', {
    headers: newHeaders,
  });
  const data = await result.json();
  return data;
}

export async function getTest4(cookieStore: ReadonlyRequestCookies) {
  'use cache';
  cacheTag('test', 'test4');

  const newHeaders = new Headers();
  newHeaders.append('x-forwared-for', '1.1.1.1');
  newHeaders.append('Cookie', cookieStore.toString());
  newHeaders.append('timestamp', Date.now().toString()); // 헤더의 값이 바뀔 때마다 캐싱이 안되고 새로 요청이 감

  const result = await fetch('http://localhost:3010/api/test/test4', {
    headers: newHeaders,
  });
  const data = await result.json();
  return data;
}
