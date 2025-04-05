'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    console.log('useEffect.number', number);

    return () => {
      console.log('useEffect.cleanup.number', number);
    };
  }, [number]);

  return (
    <>
      <div className="w-full flex flex-col gap-2 relative">
        <div>현재 number : {number}</div>
        <div>
          <button
            className="inline-flex px-3 py-1 bg-slate-200 rounded-md text-sm cursor-pointer hover:bg-slate-300"
            onClick={() => {
              setNumber((prev) => prev + 1);
            }}
          >
            +1
          </button>
        </div>
      </div>
    </>
  );
}
