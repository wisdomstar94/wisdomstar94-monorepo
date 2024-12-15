import { toJsonString, toQueryString } from '@wisdomstar94/vanilla-js-util';
import { ApiFetcherProps, ApiFetcherReturnValue, ApiPayloadRequired } from '../types';

export async function apiFetcher<T extends ApiPayloadRequired, R>(props: ApiFetcherProps<T>): Promise<ApiFetcherReturnValue<R>> {
  const { createFetchInstance, payload, url, method, controller, nextOptions } = props;
  const queryString = payload.query !== undefined ? toQueryString(payload.query) : '';

  const instance = await createFetchInstance(url + queryString, {
    method,
    body: payload.body !== undefined ? toJsonString(payload.body) : undefined,
    signal: controller?.signal,
    cache: nextOptions?.cache,
    next: nextOptions?.next,
  });
  const response = await instance.call();

  let responsePayload: R | null = null;
  if (response.status !== 204) {
    responsePayload = await response.json();
  }
  return {
    response,
    responsePayload,
  };
}
