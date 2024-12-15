'use client';

import { generateQueryStringUrl } from '@wisdomstar94/vanilla-js-util';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log('@pathname', pathname);
    console.log('@searchParams.toString()', searchParams.toString());

    const newQueryString = generateQueryStringUrl({
      queryString: searchParams.toString(),
      arrayDivider: ',',
      items: [
        {
          key: 'tag',
          value: ['tag4', 'tag5'],
          mode: 'REPLACE',
          isArray: true,
        },
      ],
    });
    console.log('@newQueryString', newQueryString);
  }, []);

  return <></>;
}
