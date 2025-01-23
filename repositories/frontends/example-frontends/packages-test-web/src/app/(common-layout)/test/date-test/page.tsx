'use client';

import { useEffect } from 'react';

export default function Page() {
  const serverSendIsoString = '2025-01-23T13:02:28.038Z';

  useEffect(() => {
    console.log('start', new Date(`2025-01-22T15:00:00.000Z`));
    console.log('end', new Date(`2025-01-23T15:00:00.000Z`));
  }, []);

  return <></>;
}
