'use client';

import { getTestInfoServerAction, useGetTestInfoServerAction } from '@/functions';

export function Buttons() {
  const getTestInfoServerActionCaller = useGetTestInfoServerAction();

  return (
    <>
      <div>
        <button
          className="inline-flex px-2 py-0.5 text-sm border border-slate-400 rounded-md cursor-pointer hover:bg-slate-100"
          onClick={() => {
            getTestInfoServerAction(
              {
                name: '홍길동',
                age: 0,
              },
              true
            ).then((res) => {
              console.log('@res', res);
            });
          }}
        >
          getTestInfoServerAction call!
        </button>

        <button
          className={`inline-flex px-2 py-0.5 text-sm border border-slate-400 rounded-md cursor-pointer hover:bg-slate-100 ${getTestInfoServerActionCaller.isLoading && 'opacity-50'}`}
          disabled={getTestInfoServerActionCaller.isLoading}
          onClick={() => {
            getTestInfoServerActionCaller
              .getCaller({
                loadingEndedBounceTime: 1000,
              })
              .call(
                {
                  name: '홍길동',
                  age: 0,
                },
                true
              );
          }}
        >
          getTestInfoServerActionCaller call!
        </button>
      </div>
    </>
  );
}
