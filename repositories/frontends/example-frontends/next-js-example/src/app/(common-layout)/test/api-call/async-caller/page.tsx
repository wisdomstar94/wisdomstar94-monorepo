import { Buttons } from './_components';
import { Suspense } from 'react';
import { countErrorApiServer } from '@/api-fetcher';

const ServerList = async () => {
  const result = await countErrorApiServer({
    payload: {
      headers: {
        'My-Header-Key': 'from server...',
      },
    },
  });

  console.log(`#result`, result);

  return <>서버측에서 가져온 데이터 : {JSON.stringify(result)}</>;
};

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
