export type ApiFetchFn<T extends ApiPayloadRequired> = (props: { payload: T }) => ApiFetchFnReturn<T>;

export type ApiFetchFnReturn<T> = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload: T;
};

export type ApiPayloadRequired = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
};

//////////////////////////////////////////////////////////////////////////////////////////////

export type ReqBody<B = void> = B extends void ? { body?: undefined } : { body: B };
export type ReqQuery<Q = void> = Q extends void ? { query?: undefined } : { query: Q };
export type ReqParams<P = void> = P extends void ? { params?: undefined } : { params: P };
export type ReqHeaders<H = void> = H extends void ? { headers?: undefined } : { headers: H };

export type ReqPayload<B, Q, P, H> = ReqBody<B> & ReqQuery<Q> & ReqParams<P> & ReqHeaders<H>;

//////////////////////////////////////////////////////////////////////////////////////////////

export type FetcherFn<T extends ApiPayloadRequired = ApiPayloadRequired> = (params: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  payload: T;
}) => Promise<Response>;

//////////////////////////////////////////////////////////////////////////////////////////////

export type IndivisualApiCallerFn<T extends ApiPayloadRequired, R> = (params: {
  fetcher: FetcherFn<T>;
  payload: T;
}) => Promise<{ responseStatus: number; body: R }>;
