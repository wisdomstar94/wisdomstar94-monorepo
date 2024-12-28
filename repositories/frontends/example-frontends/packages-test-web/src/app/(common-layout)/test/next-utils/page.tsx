'use client';

import { generateUrlQueryString, ReqPayload } from '@wisdomstar94/next-utils';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type ApiReqPayload = ReqPayload<
  // 요청 body
  {
    name: string;
  },
  // 요청 query
  void,
  // 요청 params
  void
>;

export default function Page() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const apiReqPayload: ApiReqPayload = {
    body: {
      name: '홍길동',
    },
  };

  console.log('#apiReqPayload', apiReqPayload);

  useEffect(() => {
    const newUrl = generateUrlQueryString({
      pathname,
      searchParams,
      items: [
        { key: 'name', value: ['hi'], mode: 'UPSERT' },
        { key: 'status', value: ['1', '10'], mode: 'UPSERT', isArray: true },
      ],
    });
    console.log('@newUrl', newUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
