'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { generateUrlQueryString } from '@wisdomstar94/next-utils';

export function ListClient(props: { list: string[] }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div>
      <div>list client result</div>
      <div>{JSON.stringify(props.list)}</div>
      <div>
        <button
          onClick={() => {
            startTransition(() => {
              router.replace(pathname + '?time=' + Date.now());
            });
          }}
        >
          router.replace
        </button>
        <div>pending : {pending ? 'true' : 'false'}</div>
        <div>
          <button
            onClick={() => {
              router.replace(
                generateUrlQueryString({
                  pathname,
                  searchParams,
                  items: [
                    {
                      key: 'page',
                      value: ['13'],
                      mode: 'UPSERT',
                    },
                  ],
                })
              );
            }}
          >
            replace url
          </button>
        </div>
      </div>
    </div>
  );
}
