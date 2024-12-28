import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { getTest4 } from '../_macros/rsc-macros';

// 백엔드 필요: yarn @wisdomstar94/test-epxress dev

async function Contents() {
  const cookieStore = await cookies();
  const data = await getTest4(cookieStore);
  return <>{JSON.stringify(data)}</>;
}

export default function Page() {
  return (
    <div className="w-full bg-red-300 box-border p-4 block">
      <Suspense fallback={<>loading...</>}>
        <Contents />
      </Suspense>
    </div>
  );
}
