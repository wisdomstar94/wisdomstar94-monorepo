'use server';

import { toJsonString, toQueryString } from '@wisdomstar94/vanilla-js-util';
import { ApiFetcherProps, ApiFetcherResultCommon, ApiPayloadRequired } from '../types';
import { fetchServer } from './fetch.server';

export async function apiFetcherServer<T extends ApiPayloadRequired, R>(
  props: ApiFetcherProps<T>
): Promise<ApiFetcherResultCommon<R>> {
  const {
    url,
    method,
    payload,
    controller,
    // nextOptions
  } = props;

  const queryString = payload.query !== undefined ? toQueryString(payload.query) : '';

  const res = await fetchServer({
    url: url + queryString,
    requestInit: {
      method,
      body: payload.body !== undefined ? toJsonString(payload.body) : undefined,
      signal: controller?.signal,
      headers: payload.headers,
      // cache: nextOptions?.cache,
      // next: nextOptions?.next,
    },
  });

  if (res.status >= 400 && res.status < 600) {
    const result: ApiFetcherResultCommon<R> = {
      statusCode: res.status,
      responsePayload: null,
    };
    const resClone = res.clone();
    try {
      result.error = await res.json();
    } catch (e) {
      result.responseText = await resClone.text();
    }
    throw result;
  }

  let responsePayload: R | null = null;
  let responseText: string | undefined = undefined;
  if (res.status !== 204) {
    const resClone = res.clone();
    try {
      responsePayload = await res.json();
    } catch (e) {
      responseText = await resClone.text();
    }
  }

  return {
    statusCode: res.status,
    responsePayload,
    responseText,
  };
}
