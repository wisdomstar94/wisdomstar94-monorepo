'use client';

import { usePathname, useRouter } from 'next/navigation';
import { use } from 'react';

export type ClientCompProps = {
  dataPromise: Promise<unknown>;
};

export function ClientComp({ dataPromise }: ClientCompProps) {
  const data = use(dataPromise);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-full flex flex-col gap-2 relative">
      <div>ClientComp.data: {JSON.stringify(data)}</div>
      <div>
        <button
          onClick={() => {
            router.replace(`${pathname}?timestamp=${Date.now()}`);
          }}
        >
          replace url
        </button>
      </div>
    </div>
  );
}
