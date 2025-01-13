'use client';

import { useVisibleObserver } from '@wisdomstar94/react-visible-observer-box';

export default function Page() {
  const visibleObserver = useVisibleObserver();
  const items = Array.from({ length: 100 });

  return (
    <>
      <div className="inline-flex bg-red-500 text-white fixed top-2 right-2 z-[10] px-2 py-0.5">
        {visibleObserver.activeIndex}
      </div>

      <div className="w-full flex flex-col gap-2 relative">
        {items.map((item, index) => {
          return visibleObserver.visibleObserverBox({
            customKey: index,
            index,
            className: 'w-full h-[300px] border border-slate-700 box-border',
            options: {
              rootMargin: '-48px 0px 0px 0px',
            },
            children: <>index: {index}</>,
          });
        })}
      </div>
    </>
  );
}
