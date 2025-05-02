import { countErrorApiServer, isApiFetcherResultCommon } from '@/api-fetcher-v2';
import { Buttons } from './_components';
import { Suspense } from 'react';

async function ServerInfo() {
  try {
    const result = await countErrorApiServer({ payload: { headers: { 'My-Header-Key': 'from server...' } } });

    console.log(`#result`, result);

    return <>서버측에서 가져온 정보 : {JSON.stringify(result.responsePayload)}</>;
  } catch (error) {
    if (isApiFetcherResultCommon(error)) {
      return <>서버측 에러 발생: {JSON.stringify(error)}</>;
    } else {
      return <>서버측 예상치 못한 에러 발생</>;
    }
  }
}

export default async function Page() {
  return (
    <>
      <Buttons />
      <Suspense fallback={<>Loading...</>}>
        <ServerInfo />
      </Suspense>
    </>
  );
}
