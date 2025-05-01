'use client';

import { toJsonString, toQueryString } from '@wisdomstar94/vanilla-js-util';
import { fetchClient } from '../fetch-wrapper';
import { ApiFetcherProps, ApiFetcherResultCommon, ApiPayloadRequired } from '../types';

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
    try {
      const responsePayload = await res.json();
      result.error = responsePayload;
      throw result;
    } catch (e) {
      const text = await res.text();
      result.error = text;
      throw result;
    }
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
