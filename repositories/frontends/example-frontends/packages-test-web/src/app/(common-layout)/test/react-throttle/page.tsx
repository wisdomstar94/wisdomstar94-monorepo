'use client';

import { useAddEventListener } from '@wisdomstar94/react-add-event-listener';
import { useThrottle } from '@wisdomstar94/react-throttle';

export default function Page() {
  const scrollEventThrottle = useThrottle({
    throttleTime: 1000,
    throttleMaxCount: 2,
    fn: () => {
      console.log('@스크롤 됨!');
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'scroll',
      eventListener() {
        scrollEventThrottle.call();
      },
    },
  });

  return (
    <div className={'flex flex-col gap-2 relative'}>
      <button className="inline-flex border border-slate-300 px-2 py-0.5 text-xs cursor-pointer hover:bg-slate-50" onClick={() => {}}>
        call
      </button>
      <div>{scrollEventThrottle.isThrottled ? '쓰로틀 걸린 상태...' : '쓰로틀 풀린 상태...'}</div>
      <div className="w-full h-[1200px] bg-red-500"></div>
    </div>
  );
}
