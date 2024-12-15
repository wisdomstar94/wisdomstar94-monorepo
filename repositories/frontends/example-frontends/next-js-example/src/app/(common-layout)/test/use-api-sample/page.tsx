'use client';

import { useTestListApi } from '@/api-fetcher';

export default function Page() {
  const testListApi = useTestListApi();

  return (
    <>
      <div className="w-full relative">
        <button
          className="inline-flex px-2 py-0.5 text-xs bg-blue-500 text-white rounded-sm cursor-pointer hover:bg-blue-600"
          onClick={() => {
            testListApi.setPayload({});
          }}
        >
          list 불러오기
        </button>
      </div>
      <ul className="w-full flex flex-col gap-2 relative">
        {testListApi.api.isLoading
          ? 'loading...'
          : testListApi.api.result?.responsePayload?.map((item, index) => {
              return (
                <li key={`${index}_${item.id}`} className="border border-slate-400 px-2 py-0.5 text-xs">
                  id: {item.id} <br />
                  name: {item.name}
                </li>
              );
            })}
      </ul>
    </>
  );
}
