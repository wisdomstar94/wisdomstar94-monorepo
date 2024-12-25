'use client';

// import "@wisdomstar94/react-add-event-listener/style.css";
import { TestBox, useAddEventListener, getVersion } from '@wisdomstar94/react-add-event-listener';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const router = useRouter();
  const [number, setNumber] = useState(0);

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'click',
      eventListener(event) {
        console.log('@window.click', event);
      },
    },
  });

  useEffect(() => {
    // getEventListeners 은 정식 api 가 아님.
    // 코드 상에선 호출 할 수 없고, chrome dev tools 콘솔 창에서는 호출 가능함.
    // 아래 코드는 호출 예시 목적으로 작성함.
    const getEventListeners = (window as any).getEventListeners;
    if (typeof getEventListeners === 'function') {
      console.log(`getEventListeners(window)`, getEventListeners(window));
    }
  }, [number]);

  return (
    <>
      test/basic!
      <TestBox />
      <div>{getVersion()}</div>
      <div>
        <button
          onClick={() => {
            // router.back();
            setNumber((prev) => prev + 1);
          }}
        >
          1 증가
        </button>
      </div>
      <div>({number})</div>
    </>
  );
}
