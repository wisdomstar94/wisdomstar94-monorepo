export type ApiFetcherProps<T extends ApiPayloadRequired> = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload: T;
  controller?: AbortController;
  nextOptions?: NextOptions;
};

export type ApiPayloadRequired = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
};

export type NextOptions = Pick<RequestInit, 'cache' | 'next'>;

export type ApiFetcherResultCommon<R> = {
  statusCode: number;
  responsePayload: R | null;
  responseText?: string;
  error?: unknown;
};
export function isApiFetcherResultCommon<T>(v: unknown): v is ApiFetcherResultCommon<T> {
  if (typeof v !== 'object') return false;
  if (v === null) return false;

  const keys = Object.keys(v);

  const isStatusCodeExist = keys.includes('statusCode');
  const isResponsePayloadExist = keys.includes('responsePayload');

  return isStatusCodeExist && isResponsePayloadExist;
}

export type ReqBody<B = void> = B extends void ? { body?: undefined } : { body: B };
export type ReqQuery<Q = void> = Q extends void ? { query?: undefined } : { query: Q };
export type ReqParams<P = void> = P extends void ? { params?: undefined } : { params: P };
export type ReqHeaders<H = void> = H extends void ? { headers?: undefined } : { params: H };

export type ReqPayload<B, Q, P, H> = ReqBody<B> & ReqQuery<Q> & ReqParams<P> & ReqHeaders<H>;

export type ApiFetcherIndivisualFn<T extends ApiPayloadRequired, R> = (props: {
  payload: T;
}) => Promise<ApiFetcherResultCommon<R>>;

export type ApiFetcherOverviewFn<T extends ApiPayloadRequired> = (props: { payload: T }) => {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload: T;
};
