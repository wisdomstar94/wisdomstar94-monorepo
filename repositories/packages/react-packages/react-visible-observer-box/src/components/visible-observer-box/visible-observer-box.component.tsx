import { useEffect, useRef } from 'react';
import { IVisibleObserverBox } from './visible-observer-box.interface';

export function VisibleObserverBox(props: IVisibleObserverBox.Props) {
  const { index, customKey, className, onChangeVisibility, children, options } = props;
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (typeof onChangeVisibility !== 'function') {
          return;
        }
        onChangeVisibility(entry.isIntersecting);
      });
    }, options);

    if (divRef.current !== null) {
      observer.observe(divRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div key={customKey} ref={divRef} className={className} data-visible-observer-box-index={index}>
      {children}
    </div>
  );
}
