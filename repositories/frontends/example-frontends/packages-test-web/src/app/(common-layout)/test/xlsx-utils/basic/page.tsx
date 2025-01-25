'use client';

import { generateExcel } from '@wisdomstar94/xlsx-utils';
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    generateExcel({});
  }, []);

  return <></>;
}
