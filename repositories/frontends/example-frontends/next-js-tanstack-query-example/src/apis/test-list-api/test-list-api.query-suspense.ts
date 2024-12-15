import { useSuspenseQuery } from '@tanstack/react-query';
import { testListApiStaleTime, testListApiQueryKey } from './test-list-api.query-options';
import { testListApiQueryFn } from './test-list-api.query-fn';
import { testListApi } from './test-list-api';

type ReqPayload = Parameters<typeof testListApi>[0];

export function useQuerySuspenseTestListApi(payload: ReqPayload) {
  const query = useSuspenseQuery({
    queryKey: testListApiQueryKey(payload.params),
    queryFn: testListApiQueryFn(payload),
    staleTime: testListApiStaleTime,
  });

  return {
    query,
  };
}
