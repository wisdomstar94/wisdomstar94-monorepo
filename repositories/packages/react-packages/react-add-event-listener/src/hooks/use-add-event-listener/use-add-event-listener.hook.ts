import { useEffect, useRef } from 'react';
import { IUseAddEventListener } from './use-add-event-listener.interface';

export function useAddEventListener<K extends keyof HTMLElementEventMap, T extends keyof WindowEventMap, E extends HTMLElement>(
  props: IUseAddEventListener.Props<K, T, E>
) {
  const { domEventRequiredInfo, windowEventRequiredInfo } = props;

  const savedDomEventRequiredInfoRef = useRef<IUseAddEventListener.DomEventRequiredInfo<K, E> | undefined>(undefined);
  const savedWindowEventRequiredInfoRef = useRef<IUseAddEventListener.WindowEventRequiredInfo<T> | undefined>(undefined);

  const fixedCallbackElementEventRef = useRef((event: HTMLElementEventMap[K]) => {
    if (savedDomEventRequiredInfoRef.current !== undefined) {
      savedDomEventRequiredInfoRef.current.eventListener(event);
    }
  });

  const fixedCallbackWindowEventRef = useRef((event: WindowEventMap[T]) => {
    if (savedWindowEventRequiredInfoRef.current !== undefined) {
      savedWindowEventRequiredInfoRef.current.eventListener(event);
    }
  });

  function isTargetRef(value: unknown): value is { current: E | null } {
    if (typeof value !== 'object') return false;
    if (value === null) return false;

    const keys = Object.keys(value);
    if (!keys.includes('current')) {
      return false;
    }

    return true;
  }

  function isTargetSelector(value: unknown): value is IUseAddEventListener.SelectorString {
    if (typeof value !== 'string') return false;
    if (!value.startsWith(`selector:`)) return false;
    if (value.length <= 10) return false;
    return true;
  }

  useEffect(() => {
    const removeEvent = () => {
      if (domEventRequiredInfo !== undefined) {
        const { target, eventName, eventListener, options } = domEventRequiredInfo;

        if (isTargetRef(target)) {
          target.current?.removeEventListener(eventName, fixedCallbackElementEventRef.current);
        } else if (isTargetSelector(target)) {
          const element = document.querySelector<HTMLElement>(target.replace(`selector:`, ''));
          element?.removeEventListener(eventName, fixedCallbackElementEventRef.current);
        }
      }

      if (savedDomEventRequiredInfoRef.current !== undefined) {
        const { target, eventName, eventListener, options } = savedDomEventRequiredInfoRef.current;

        if (isTargetRef(target)) {
          target.current?.removeEventListener(eventName, fixedCallbackElementEventRef.current);
        } else if (isTargetSelector(target)) {
          const element = document.querySelector<HTMLElement>(target.replace(`selector:`, ''));
          element?.removeEventListener(eventName, fixedCallbackElementEventRef.current);
        }
      }
    };
    removeEvent();

    if (domEventRequiredInfo !== undefined) {
      const { target, eventName, eventListener, options } = domEventRequiredInfo;
      if (isTargetRef(target)) {
        target.current?.addEventListener(eventName, fixedCallbackElementEventRef.current, options);
      } else if (isTargetSelector(target)) {
        const element = document.querySelector<HTMLElement>(target.replace(`selector:`, ''));
        element?.addEventListener(eventName, fixedCallbackElementEventRef.current, options);
      }
    }

    return () => {
      removeEvent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domEventRequiredInfo?.target, domEventRequiredInfo?.eventName, domEventRequiredInfo?.eventListener, domEventRequiredInfo?.options]);

  useEffect(() => {
    savedDomEventRequiredInfoRef.current = domEventRequiredInfo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domEventRequiredInfo?.target, domEventRequiredInfo?.eventName, domEventRequiredInfo?.eventListener, domEventRequiredInfo?.options]);

  useEffect(() => {
    const removeEvent = () => {
      if (windowEventRequiredInfo !== undefined && typeof window !== 'undefined') {
        const { eventName, eventListener, options } = windowEventRequiredInfo;

        window.removeEventListener(eventName, fixedCallbackWindowEventRef.current);
      }

      if (savedWindowEventRequiredInfoRef.current !== undefined && typeof window !== 'undefined') {
        const { eventName, eventListener, options } = savedWindowEventRequiredInfoRef.current;

        window.removeEventListener(eventName, fixedCallbackWindowEventRef.current);
      }
    };
    removeEvent();

    if (windowEventRequiredInfo !== undefined && typeof window !== 'undefined') {
      const { eventName, eventListener, options } = windowEventRequiredInfo;
      window.addEventListener(eventName, fixedCallbackWindowEventRef.current, options);
    }

    return () => {
      removeEvent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowEventRequiredInfo?.eventName, windowEventRequiredInfo?.eventListener, windowEventRequiredInfo?.options]);

  useEffect(() => {
    savedWindowEventRequiredInfoRef.current = windowEventRequiredInfo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowEventRequiredInfo?.eventName, windowEventRequiredInfo?.eventListener, windowEventRequiredInfo?.options]);

  return {};
}
