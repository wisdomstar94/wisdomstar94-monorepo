'use client';

import { useEffect, useRef, useState } from 'react';
import { ApiPayloadRequired, UseApiFetcherHookReturnType } from '../types';

export type ParallelResult<
  T1 extends ApiPayloadRequired,
  R1,
  T2 extends ApiPayloadRequired,
  R2,
  T3 extends ApiPayloadRequired,
  R3,
  T4 extends ApiPayloadRequired,
  R4,
  T5 extends ApiPayloadRequired,
  R5,
> = {
  task1: {
    isSuccess: boolean | null;
    error?: unknown;
    result?: UseApiFetcherHookReturnType<T1, R1>['api']['result'];
  };
  task2?: {
    isSuccess: boolean | null;
    error?: unknown;
    result?: UseApiFetcherHookReturnType<T2, R2>['api']['result'];
  };
  task3?: {
    isSuccess: boolean | null;
    error?: unknown;
    result?: UseApiFetcherHookReturnType<T3, R3>['api']['result'];
  };
  task4?: {
    isSuccess: boolean | null;
    error?: unknown;
    result?: UseApiFetcherHookReturnType<T4, R4>['api']['result'];
  };
  task5?: {
    isSuccess: boolean | null;
    error?: unknown;
    result?: UseApiFetcherHookReturnType<T5, R5>['api']['result'];
  };
};

// export type StartedTaskExistFlag = {
//   task1: boolean;
//   task2: boolean;
//   task3: boolean;
//   task4: boolean;
//   task5: boolean;
// };

export type UseApiParallelProps<
  T1 extends ApiPayloadRequired,
  R1,
  T2 extends ApiPayloadRequired,
  R2,
  T3 extends ApiPayloadRequired,
  R3,
  T4 extends ApiPayloadRequired,
  R4,
  T5 extends ApiPayloadRequired,
  R5,
> = {
  task1: {
    api: UseApiFetcherHookReturnType<T1, R1>;
    callback: (setPayload: UseApiFetcherHookReturnType<T1, R1>['setPayload']) => void;
  };
  task2?: {
    api: UseApiFetcherHookReturnType<T2, R2>;
    callback: (setPayload: UseApiFetcherHookReturnType<T2, R2>['setPayload']) => void;
  };
  task3?: {
    api: UseApiFetcherHookReturnType<T3, R3>;
    callback: (setPayload: UseApiFetcherHookReturnType<T3, R3>['setPayload']) => void;
  };
  task4?: {
    api: UseApiFetcherHookReturnType<T4, R4>;
    callback: (setPayload: UseApiFetcherHookReturnType<T4, R4>['setPayload']) => void;
  };
  task5?: {
    api: UseApiFetcherHookReturnType<T5, R5>;
    callback: (setPayload: UseApiFetcherHookReturnType<T5, R5>['setPayload']) => void;
  };
};

export function useApiParallel<
  T1 extends ApiPayloadRequired,
  R1,
  T2 extends ApiPayloadRequired,
  R2,
  T3 extends ApiPayloadRequired,
  R3,
  T4 extends ApiPayloadRequired,
  R4,
  T5 extends ApiPayloadRequired,
  R5,
>(props: UseApiParallelProps<T1, R1, T2, R2, T3, R3, T4, R4, T5, R5>) {
  const { task1, task2, task3, task4, task5 } = props;

  // const startedTaskExistFlagRef = useRef<StartedTaskExistFlag>();
  const [parallelResult, setParallelResult] =
    useState<ParallelResult<T1, R1, T2, R2, T3, R3, T4, R4, T5, R5>>();
  const parallelResultRef = useRef<
    ParallelResult<T1, R1, T2, R2, T3, R3, T4, R4, T5, R5>
  >({
    task1: {
      isSuccess: null,
    },
  });

  const isLoadingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [callbackInnerError, setCallbackInnerError] = useState<unknown>();

  function changeIsLoading(v: boolean) {
    isLoadingRef.current = v;
    setIsLoading(v);
  }

  function checkAllCompleted() {
    const task1IsSuccess = parallelResultRef.current.task1.isSuccess;
    const task2IsSuccess = parallelResultRef.current.task2?.isSuccess;
    const task3IsSuccess = parallelResultRef.current.task3?.isSuccess;
    const task4IsSuccess = parallelResultRef.current.task4?.isSuccess;
    const task5IsSuccess = parallelResultRef.current.task5?.isSuccess;

    // console.log('@checkAllCompleted()');
    // console.log('@task1IsSuccess', task1IsSuccess);
    // console.log('@task2IsSuccess', task2IsSuccess);
    // console.log('@task3IsSuccess', task3IsSuccess);
    // console.log('@task4IsSuccess', task4IsSuccess);
    // console.log('@task5IsSuccess', task5IsSuccess);

    if (
      task1IsSuccess === null ||
      task2IsSuccess === null ||
      task3IsSuccess === null ||
      task4IsSuccess === null ||
      task5IsSuccess === null
    ) {
      return;
    }

    changeIsLoading(false);
    setParallelResult(parallelResultRef.current);
  }

  function start() {
    if (isLoadingRef.current) {
      console.warn(`이미 호출 중입니다.`);
      return;
    }
    parallelResultRef.current = {
      task1: {
        isSuccess: null,
      },
      task2:
        task2 === undefined
          ? undefined
          : {
              isSuccess: null,
            },
      task3:
        task3 === undefined
          ? undefined
          : {
              isSuccess: null,
            },
      task4:
        task4 === undefined
          ? undefined
          : {
              isSuccess: null,
            },
      task5:
        task5 === undefined
          ? undefined
          : {
              isSuccess: null,
            },
    };

    changeIsLoading(true);

    try {
      task1.callback(task1.api.setPayload);
    } catch (e) {
      parallelResultRef.current.task1 = {
        isSuccess: false,
        error: e,
      };
      setCallbackInnerError(e);
      checkAllCompleted();
    }

    try {
      task2?.callback(task2.api.setPayload);
    } catch (e) {
      parallelResultRef.current.task2 = {
        isSuccess: false,
        error: e,
      };
      setCallbackInnerError(e);
      checkAllCompleted();
    }

    try {
      task3?.callback(task3.api.setPayload);
    } catch (e) {
      parallelResultRef.current.task3 = {
        isSuccess: false,
        error: e,
      };
      setCallbackInnerError(e);
      checkAllCompleted();
    }

    try {
      task4?.callback(task4.api.setPayload);
    } catch (e) {
      parallelResultRef.current.task4 = {
        isSuccess: false,
        error: e,
      };
      setCallbackInnerError(e);
      checkAllCompleted();
    }

    try {
      task5?.callback(task5.api.setPayload);
    } catch (e) {
      parallelResultRef.current.task5 = {
        isSuccess: false,
        error: e,
      };
      setCallbackInnerError(e);
      checkAllCompleted();
    }
  }

  // task1 처리
  useEffect(() => {
    if (task1.api.api.result === undefined) return;
    if (!isLoadingRef.current) return;
    parallelResultRef.current.task1 = {
      isSuccess: true,
      result: task1.api.api.result,
    };
    checkAllCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task1.api.api.result]);

  useEffect(() => {
    if (task1.api.api.error === undefined) return;
    if (!isLoadingRef.current) return;
    parallelResultRef.current.task1 = {
      isSuccess: false,
      error: task1.api.api.error,
    };
    checkAllCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task1.api.api.error]);

  // task2 처리
  useEffect(() => {
    if (task2?.api.api.result === undefined) return;
    if (!isLoadingRef.current) return;
    parallelResultRef.current.task2 = {
      isSuccess: true,
      result: task2.api.api.result,
    };
    checkAllCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task2?.api.api.result]);

  useEffect(() => {
    if (task2?.api.api.error === undefined) return;
    if (!isLoadingRef.current) return;
    parallelResultRef.current.task2 = {
      isSuccess: false,
      error: task2.api.api.error,
    };
    checkAllCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task2?.api.api.error]);

  // task3 처리
  useEffect(() => {
    if (task3?.api.api.result === undefined) return;
    if (!isLoadingRef.current) return;
    parallelResultRef.current.task3 = {
      isSuccess: true,
      result: task3.api.api.result,
    };
    checkAllCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task3?.api.api.result]);

  useEffect(() => {
    if (task3?.api.api.error === undefined) return;
    if (!isLoadingRef.current) return;
    parallelResultRef.current.task3 = {
      isSuccess: false,
      error: task3.api.api.error,
    };
    checkAllCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task3?.api.api.error]);

  // task4 처리
  useEffect(() => {
    if (task4?.api.api.result === undefined) return;
    if (!isLoadingRef.current) return;
    parallelResultRef.current.task4 = {
      isSuccess: true,
      result: task4.api.api.result,
    };
    checkAllCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task4?.api.api.result]);

  useEffect(() => {
    if (task4?.api.api.error === undefined) return;
    if (!isLoadingRef.current) return;
    parallelResultRef.current.task4 = {
      isSuccess: false,
      error: task4.api.api.error,
    };
    checkAllCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task4?.api.api.error]);

  // task5 처리
  useEffect(() => {
    if (task5?.api.api.result === undefined) return;
    if (!isLoadingRef.current) return;
    parallelResultRef.current.task5 = {
      isSuccess: true,
      result: task5.api.api.result,
    };
    checkAllCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task5?.api.api.result]);

  useEffect(() => {
    if (task5?.api.api.error === undefined) return;
    if (!isLoadingRef.current) return;
    parallelResultRef.current.task5 = {
      isSuccess: false,
      error: task5.api.api.error,
    };
    checkAllCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task5?.api.api.error]);

  return {
    parallelResult,
    start,
    isLoading,
    callbackInnerError,
  };
}
