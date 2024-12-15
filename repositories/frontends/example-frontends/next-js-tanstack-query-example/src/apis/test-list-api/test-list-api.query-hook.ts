'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { testListApiStaleTime, testListApiQueryKey } from './test-list-api.query-options';
import { testListApiQueryFn } from './test-list-api.query-fn';
import { getQueryClient } from '@/app/tanstack-query/get-query-client';
import { testListApi } from './test-list-api';

type ReqPayload = Parameters<typeof testListApi>[0];

export function useQueryTestListApi(params: ReqPayload['params'], initialPayload?: ReqPayload) {
  const [payload, setPayload] = useState<ReqPayload | undefined>(initialPayload);

  const query = useQuery({
    queryKey: testListApiQueryKey(params),
    queryFn: testListApiQueryFn(payload!),
    staleTime: testListApiStaleTime, // 가장 최근의 fetch 로부터 해당 밀리세컨드 초동안 캐싱된 데이터 재사용
    enabled: payload !== undefined,
  });

  function removeQuery(params: ReqPayload['params']) {
    getQueryClient().removeQueries({
      queryKey: testListApiQueryKey(params),
    });
  }

  useEffect(() => {
    if (payload === undefined) return;
    if (!query.isStale) return;
    query.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload]);

  return {
    query,
    payload,
    setPayload,
    removeQuery,
  };
}
