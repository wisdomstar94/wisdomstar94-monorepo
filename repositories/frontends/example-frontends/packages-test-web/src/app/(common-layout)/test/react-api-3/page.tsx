'use client';

import { useApi } from '@wisdomstar94/react-api';
import { useEffect, useState } from 'react';

export default function Page() {
  const [payload, setPayload] = useState<Record<string, unknown> | undefined>(undefined);
  const sampleInfo = useApi({
    api: () => {
      return {
        fn: async () => {
          const result = await fetch(`http://localhost:3010/api/test/test1`);
          const body = await result.json();
          return body;
        },
        cancel: undefined,
      };
    },
    autoFetchDependencies: [payload],
    enabledAutoFetch: true,
    enabled: payload !== undefined,
    loadingEndedBounceTime: 1000,
  });

  useEffect(() => {
    if (sampleInfo.result === undefined) return;
    console.log('@sampleInfo.result', sampleInfo.result);
  }, [sampleInfo.result]);

  useEffect(() => {
    console.log('@@sampleInfo.isLoading', sampleInfo.isLoading);
  }, [sampleInfo.isLoading]);

  useEffect(() => {
    console.log('@@sampleInfo.error', sampleInfo.error);
  }, [sampleInfo.error]);

  useEffect(() => {
    console.log('@@payload', payload);
  }, [payload]);

  return (
    <div className="w-full flex flex-col gap-2 relative">
      <button
        className="inline-flex border border-slate-500 px-2 py-0.5 text-xs rounded-e-md hover:bg-slate-100"
        onClick={() => {
          setPayload({});
        }}
      >
        fetch
      </button>
      <div className="inline-flex gap-2 relative">sampleInfo.result : {JSON.stringify(sampleInfo.result)}</div>
      <div className="inline-flex gap-2 relative">sampleInfo.isLoading : {sampleInfo.isLoading ? 'true' : 'false'}</div>
    </div>
  );
}
