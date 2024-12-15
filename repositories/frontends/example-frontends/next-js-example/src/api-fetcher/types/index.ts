import { CreateFetchInstanceFn } from '@wisdomstar94/vanilla-js-util';
import type { apiFetcher, useApiFetcher } from '../macros';

export type NextOptions = Pick<RequestInit, 'cache' | 'next'>;

export type ApiPayloadRequired = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
};
export type Method = 'POST' | 'GET' | 'DELETE' | 'PATCH' | 'PUT';

export type IndividualApiFn<T extends ApiPayloadRequired, R> = (props: {
  createFetchInstance: CreateFetchInstanceFn;
  payload: T;
  controller?: AbortController;
  nextOptions?: NextOptions;
}) => ReturnType<typeof apiFetcher<T, R>>;

// export type IndividualServerActionFn<T extends ApiPayloadRequired, R> = (
//   payload: T
// ) => ApiFetcherReturnValue<R>;

export type IndividualApiActionFn<T extends ApiPayloadRequired, R> = (payload: T) => Promise<ApiFetcherActionReturnType<R>>;

export type ApiFetcherProps<T> = {
  createFetchInstance: CreateFetchInstanceFn;
  payload: T;
  url: string;
  method: Method;
  controller?: AbortController;
  nextOptions?: NextOptions;
};

type ApiFetcherHookPropsApiFn<T extends ApiPayloadRequired, R> = {
  apiFn: IndividualApiFn<T, R>;
  apiActionFn?: never;
};
type ApiFetcherHookPropsApiActionFn<T extends ApiPayloadRequired, R> = {
  apiFn?: never;
  apiActionFn: IndividualApiActionFn<T, R>;
};
export type ApiFetcherHookProps<T extends ApiPayloadRequired, R> = ApiFetcherHookPropsApiFn<T, R> | ApiFetcherHookPropsApiActionFn<T, R>;

export type ReqBody<B = void> = B extends void ? { body?: void } : { body: B };
export type ReqQuery<Q = void> = Q extends void ? { query?: void } : { query: Q };
export type ReqParams<P = void> = P extends void ? { params?: void } : { params: P };

export type ReqPayload<B, Q, P> = ReqBody<B> & ReqQuery<Q> & ReqParams<P>;

export type ApiFetcherReturnValue<R> = {
  response?: Response;
  responsePayload: R | null;
};

export type UseApiFetcherHookReturnType<T extends ApiPayloadRequired, R> = ReturnType<typeof useApiFetcher<T, R>>;

export type ApiFetcherActionReturnType<R> = {
  responsePayload?: R | null;
  error?: unknown;
};
