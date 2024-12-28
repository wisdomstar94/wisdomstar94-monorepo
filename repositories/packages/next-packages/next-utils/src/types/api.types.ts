export type ReqBody<B = void> = B extends void ? { body?: void } : { body: B };
export type ReqQuery<Q = void> = Q extends void ? { query?: void } : { query: Q };
export type ReqParams<P = void> = P extends void ? { params?: void } : { params: P };

export type ReqPayload<B, Q, P> = ReqBody<B> & ReqQuery<Q> & ReqParams<P>;

export type ReqMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
