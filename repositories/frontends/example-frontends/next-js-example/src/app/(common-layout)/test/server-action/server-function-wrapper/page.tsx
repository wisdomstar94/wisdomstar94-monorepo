'use client';

import { getTestInfoServerAction } from '@/server-functions';

export default function Page() {
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
      </div>
    </>
  );
}
