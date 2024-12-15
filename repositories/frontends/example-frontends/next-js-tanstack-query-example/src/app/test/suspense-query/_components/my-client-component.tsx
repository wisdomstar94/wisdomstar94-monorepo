'use client';

import { useQuerySuspenseTestListApi } from '@/apis';

export function MyClientComponent() {
  const { query } = useQuerySuspenseTestListApi({ params: { id: 1 }, query: { name: 'z' } });

  return <>data: {JSON.stringify(query.data)}</>;
}
