'use client';

import { toQueryString, type ApiPayloadRequired, type FetcherFn } from '@/api-fetcher';

export const fetcherClient: FetcherFn = async <T extends ApiPayloadRequired>(params: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  payload: T;
}) => {
  const { url, method, payload } = params;

  // before action...
  // ...

  const queryString = payload.query !== undefined ? toQueryString(payload.query) : '';
  const result = await fetch(url + queryString, {
    method,
    body: payload.body !== undefined ? JSON.stringify(payload.body) : undefined,
    headers: payload.headers !== undefined ? payload.headers : undefined,
  });

  // after action...
  // ...
  if (result.status >= 400 && result.status < 600) {
    throw result;
    // const body = await (async () => {
    //   try {
    //     return await result.clone().json();
    //   } catch (e) {
    //     return await result.clone().text();
    //   }
    // })();

    // throw body;
  }

  return result;
};
