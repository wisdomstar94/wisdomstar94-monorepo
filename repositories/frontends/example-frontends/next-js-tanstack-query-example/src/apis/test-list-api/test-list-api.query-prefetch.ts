import { testListApiStaleTime, testListApiQueryKey } from './test-list-api.query-options';
import { testListApiQueryFn } from './test-list-api.query-fn';
import { QueryClient } from '@tanstack/react-query';
import { testListApi } from './test-list-api';

// data 는 클라이언트에 전달되지만, error 는 전달되지 않음.
// 즉, prefetch 했을 때 error 가 발생해도 클라이언트에서 error 객체에는 여전히 null 인 상태임.
export async function testListApiQueryPreFetch(queryClient: QueryClient, payload: Parameters<typeof testListApi>[0]) {
  await queryClient.prefetchQuery({
    queryKey: testListApiQueryKey(payload.params),
    queryFn: testListApiQueryFn(payload),
    staleTime: testListApiStaleTime,
  });
}
