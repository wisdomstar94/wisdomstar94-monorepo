'use client';

import { useConditionalErrorApi } from '@/hooks/use-conditional-error-api.hook';
import { useSampleListApi } from '@/hooks/use-sample-list-api.hook';
import { useEffect } from 'react';

export default function Page() {
  const sampleListApi = useSampleListApi();
  const conditionalErrorApi = useConditionalErrorApi();

  useEffect(() => {
    console.log('@sampleListApi.api.result', sampleListApi.api.result);
  }, [sampleListApi.api.result]);

  useEffect(() => {
    console.log('@sampleListApi.api.error', sampleListApi.api.error);
  }, [sampleListApi.api.error]);

  useEffect(() => {
    console.log('@conditionalErrorApi.api.result', conditionalErrorApi.api.result);
  }, [conditionalErrorApi.api.result]);

  useEffect(() => {
    console.log('@conditionalErrorApi.api.error', conditionalErrorApi.api.error);
  }, [conditionalErrorApi.api.error]);

  return (
    <div className="w-full flex flex-col gap-2 relative">
      <button
        className="inline-flex border border-slate-500 px-2 py-0.5 text-xs rounded-e-md hover:bg-slate-100"
        onClick={() => {
          // sampleListApi.api.fetch();
        }}
      >
        fetch
      </button>
      <div className="inline-flex gap-2 relative">sampleListApi.api.isFetched : {sampleListApi.api.isFetched ? 'true' : 'false'}</div>
      <div className="inline-flex gap-2 relative">sampleListApi.api.isLoading : {sampleListApi.api.isLoading ? 'true' : 'false'}</div>
      <div className="inline-flex gap-2 relative">
        conditionalErrorApi.api.isFetched : {conditionalErrorApi.api.isFetched ? 'true' : 'false'}
      </div>
      <div className="inline-flex gap-2 relative">
        conditionalErrorApi.api.isLoading : {conditionalErrorApi.api.isLoading ? 'true' : 'false'}
      </div>
    </div>
  );
}
