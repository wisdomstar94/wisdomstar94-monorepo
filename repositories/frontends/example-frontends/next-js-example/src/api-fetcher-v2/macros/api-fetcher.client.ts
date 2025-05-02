'use client';

import { toJsonString, toQueryString } from '@wisdomstar94/vanilla-js-util';
import { ApiFetcherProps, ApiFetcherResultCommon, ApiPayloadRequired } from '../types';
import { fetchClient } from './fetch.client';

export async function apiFetcherClient<T extends ApiPayloadRequired, R>(
  props: Omit<ApiFetcherProps<T>, 'nextOptions'>
): Promise<ApiFetcherResultCommon<R>> {
  const { url, method, payload, controller } = props;

  const queryString = payload.query !== undefined ? toQueryString(payload.query) : '';

  const res = await fetchClient({
    url: url + queryString,
    requestInit: {
      method,
      body: payload.body !== undefined ? toJsonString(payload.body) : undefined,
      signal: controller?.signal,
      headers: payload.headers,
    },
  });

  if (res.status >= 400 && res.status < 600) {
    const result: ApiFetcherResultCommon<R> = {
      statusCode: res.status,
      responsePayload: null,
    };
    const resClone = res.clone();
    try {
      result.responsePayload = await res.json();
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

  const returnResult: ApiFetcherResultCommon<R> = {
    statusCode: res.status,
    responsePayload,
  };

  if (responseText !== undefined) {
    returnResult.responseText = responseText;
  }

  return returnResult;
}
