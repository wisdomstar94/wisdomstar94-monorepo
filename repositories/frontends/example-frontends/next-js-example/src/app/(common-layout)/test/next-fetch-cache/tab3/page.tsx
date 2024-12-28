import { cookies } from 'next/headers';
import { Suspense } from 'react';

// 백엔드 필요: yarn @wisdomstar94/test-epxress dev

async function Contents() {
  const cookie = await cookies();
  const newHeaders = new Headers();
  newHeaders.append('x-forwared-for', '1.1.1.1');
  newHeaders.append('Cookie', cookie.toString());
  newHeaders.append('timestamp', Date.now().toString());

  const result = await fetch('http://localhost:3010/api/test/test3', {
    headers: newHeaders,
    cache: 'force-cache',
    next: {
      revalidate: 60,
    },
  });
  const data = await result.json();

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
