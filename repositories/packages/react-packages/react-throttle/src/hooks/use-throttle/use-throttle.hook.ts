'use client';

import { useRef, useState } from 'react';
import type { IUseThrottle } from './use-throttle.interface';
import { usePromiseInterval } from '@wisdomstar94/react-promise-interval';

export function useThrottle(props: IUseThrottle.Props) {
  const { fn } = props;
  const defaultThrottleTime = props.throttleTime;
  const defaultThrottleMaxCount = props.throttleMaxCount;
  // const [isPending, setIsPending] = useState(false);
  const executingCount = useRef<number>(0);
  const [isThrottled, setIsThrottled] = useState(false);

  function call() {
    if (executingCount.current >= defaultThrottleMaxCount) {
      setIsThrottled(true);
      return;
    }
    setIsThrottled(false);
    fn();
    executingCount.current += 1;
  }

  usePromiseInterval({
    intervalTime: defaultThrottleTime,
    fn: async () => {
      executingCount.current = 0; // count clear
      setIsThrottled(false);
    },
    isAutoStart: true,
    isCallWhenStarted: true,
  });

  return {
    call,
    isThrottled,
  };
}
