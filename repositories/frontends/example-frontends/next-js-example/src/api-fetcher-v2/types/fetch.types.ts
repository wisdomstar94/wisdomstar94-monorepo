type RequestInitSomeRemove = Omit<RequestInit, 'method'>;
type RequestInitCustom = RequestInitSomeRemove & {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
};

export type FetchProps = {
  url: string;
  requestInit: RequestInitCustom;
};
