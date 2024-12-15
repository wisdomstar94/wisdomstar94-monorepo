import { testListApiQueryPreFetch } from '@/apis/test-list-api';
import { getQueryClient } from '@/app/tanstack-query/get-query-client';
import { TestListForm } from '@/components/test-list-form';
import { TestListApiReqPayload } from '@/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

async function Content() {
  const queryClient = getQueryClient();

  const testListApiPayload: TestListApiReqPayload = {
    params: {
      id: 1,
    },
    query: {
      name: '홍길동',
    },
  };
  await testListApiQueryPreFetch(queryClient, testListApiPayload);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TestListForm />
    </HydrationBoundary>
  );
}

/**
 * @description
 * 서버 사이드에서 prefetch 로 미리 query 의 데이터를 가져와 이를 클라이언트에 넘기는 방식에서
 * 만약 queryFn 에서 throw 에러가 발생했을 때 해당 에러는 클라이언트의 query.error 에 담기지 않고 null 로 유지 됨
 */
export default function Page() {
  return (
    <>
      <div className="w-full flex flex-col items-start gap-2 relative">
        <div className="text-3xl font-bold">test1</div>
        <Suspense fallback={<>loading...</>}>
          <Content />
        </Suspense>
      </div>
    </>
  );
}
