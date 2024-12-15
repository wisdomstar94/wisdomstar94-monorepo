import { testListApiQueryPreFetch } from '@/apis/test-list-api';
import { getQueryClient } from '@/app/tanstack-query/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ReactNode } from 'react';

/**
 * @description
 * 서버 사이드에서 prefetch 로 미리 query 의 데이터를 가져와 이를 클라이언트에 넘기는 방식에서
 * 만약 queryFn 에서 throw 에러가 발생했을 때 해당 에러는 클라이언트의 query.error 에 담기지 않고 null 로 유지 됨
 */
export default async function Layout(props: { children: ReactNode }) {
  const queryClient = getQueryClient();

  await testListApiQueryPreFetch(queryClient, {
    params: {
      id: 1,
    },
    query: {
      name: '홍길동',
    },
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{props.children}</HydrationBoundary>;
}
