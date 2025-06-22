'use server';

import { toQueryString, type ApiPayloadRequired, type FetcherFn } from '@/api-fetcher';

export const fetcherServer: FetcherFn = async <T extends ApiPayloadRequired>(params: {
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

  if (result.status >= 400 && result.status < 600) {
    // try {
    //   throw await result.clone().json();
    // } catch (e) {
    //   throw await result.clone().text();
    // }
    throw result;
  }

  // after action...
  // ...

  return result;
};
