'use client';

import { useQueryTestListApi } from '@/apis';
import { useEffect } from 'react';

export function TestListForm() {
  const queryTestListApi = useQueryTestListApi({ id: 1 });

  useEffect(() => {
    console.log('@queryTestListApi.query.data', queryTestListApi.query.data);
  }, [queryTestListApi.query.data]);

  useEffect(() => {
    console.log('@queryTestListApi.query.error', queryTestListApi.query.error);
  }, [queryTestListApi.query.error]);

  return (
    <>
      <div>
        <button
          onClick={() => {
            queryTestListApi.setPayload({ params: { id: 1 }, query: { name: '홍길동' } });
          }}
          disabled={queryTestListApi.query.isLoading}
        >
          fetch start
        </button>
        <button
          className="bg-slate-100 rounded-sm cursor-pointer hover:bg-slate-200 text-xs px-2 py-0.5"
          onClick={() => {
            queryTestListApi.removeQuery({ id: 1 });
          }}
          disabled={queryTestListApi.query.isLoading}
        >
          delete cache
        </button>
      </div>
      <div className="w-full flex flex-wrap gap-2 relative border border-blue-400 p-2 box-border">
        isLoading: {queryTestListApi.query.isLoading ? 'true' : 'false'}
      </div>
      <div className="w-full flex flex-wrap gap-2 relative border border-blue-400 p-2 box-border">
        isFetched: {queryTestListApi.query.isFetched ? 'true' : 'false'}
      </div>
      <div className="w-full flex flex-wrap gap-2 relative border border-blue-400 p-2 box-border">
        error: {JSON.stringify(queryTestListApi.query.error)}
      </div>
      <div className="w-full flex flex-wrap gap-2 relative border border-blue-400 p-2 box-border">
        data: {JSON.stringify(queryTestListApi.query.data)}
      </div>
    </>
  );
}
