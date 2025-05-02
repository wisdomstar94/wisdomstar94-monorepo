import { testListApiServer } from '@/api-fetcher-v2';
import { Buttons } from './_components';
import { Suspense } from 'react';

async function ServerList() {
  const result = await testListApiServer({
    payload: {
      params: {},
    },
  });

  console.log(`#result`, result);

  return <>서버측에서 가져온 데이터 갯수 : {result.responsePayload?.length}</>;
}

export default async function Page() {
  return (
    <>
      <Buttons />
      <Suspense fallback={<>Loading...</>}>
        <ServerList />
      </Suspense>
    </>
  );
}
