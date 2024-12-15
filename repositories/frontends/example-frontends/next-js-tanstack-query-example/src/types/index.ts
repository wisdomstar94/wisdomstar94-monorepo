export type CommonReturn<T> = {
  error?: unknown;
  data?: T;
};

export type TestListRes = {
  timestamp: number;
  data: {
    name: string;
    age: number;
    timestamp: number;
  }[];
};

export type TestListApiReqPayload = {
  params: {
    id: number;
  };
  query: {
    name: string;
  };
};
