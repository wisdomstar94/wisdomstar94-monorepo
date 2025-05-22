'use client';

import '@wisdomstar94/react-number-flow/index.css';
import { NumberFlow } from '@wisdomstar94/react-number-flow';
import { useState } from 'react';

export default function TestReactNumberFlowPage() {
  const [inputedValue, setInputedValue] = useState<number>(0);
  const [value, setValue] = useState<number>(25700);

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <div className={'text-red-500 font-bold text-2xl'}>
          <NumberFlow value={value} />
        </div>
        <div>
          <input
            type="number"
            value={inputedValue}
            onChange={(e) => {
              const v = e.target.value;
              setInputedValue(Number(v));
            }}
          />{' '}
          <button
            onClick={() => {
              setValue(inputedValue);
            }}
          >
            으로 바꾸기
          </button>
        </div>
      </div>
    </>
  );
}
