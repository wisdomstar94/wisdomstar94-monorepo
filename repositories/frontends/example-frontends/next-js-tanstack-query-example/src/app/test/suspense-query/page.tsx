import { Suspense } from 'react';
import { MyClientComponent } from './_components/my-client-component';

/**
 * @description
 * SuspenseQuery 방식은 만약 queryFn 에서 throw 에러가 발생했을 때 500 에러 페이지로 자동 리다이렉트 됨.
 */
export default function Page() {
  return (
    <>
      <div className="w-full flex flex-col items-start gap-2 relative">
        <div className="text-3xl font-bold">test1</div>
        <Suspense fallback={<>클라 컴포 loading..</>}>
          <MyClientComponent />
        </Suspense>
        <div>선 렌더링~</div>
      </div>
    </>
  );
}
