'use client';

import { FetchProps } from '../types';

export async function fetchClient(props: FetchProps) {
  const { url, requestInit } = props;

  // 공통 헤더 추가
  const reqHeaders = new Headers(requestInit.headers);
  reqHeaders.append('Content-Type', 'application/json');
  requestInit.headers = reqHeaders;

  // 쿠키를 포함하여 요청
  requestInit.credentials = 'include';

  // fetch 호출
  const res = await fetch(url, requestInit);

  return res;
}
