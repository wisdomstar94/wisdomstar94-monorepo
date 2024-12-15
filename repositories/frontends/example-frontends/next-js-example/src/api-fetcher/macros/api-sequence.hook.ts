'use client';

import { useEffect, useRef, useState } from 'react';
import { ApiPayloadRequired, UseApiFetcherHookReturnType } from '../';

export type SequenceResult = {
  step1: {
    isSuccess: boolean;
    error?: unknown;
  };
  step2?: {
    isSuccess: boolean;
    error?: unknown;
  };
  step3?: {
    isSuccess: boolean;
    error?: unknown;
  };
  step4?: {
    isSuccess: boolean;
    error?: unknown;
  };
  step5?: {
    isSuccess: boolean;
    error?: unknown;
  };
};

export type UseApiSequenceProps<
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
  step1: {
    api: UseApiFetcherHookReturnType<T1, R1>;
    callback: (setPayload: UseApiFetcherHookReturnType<T1, R1>['setPayload']) => void;
  };
  step2?: {
    api: UseApiFetcherHookReturnType<T2, R2>;
    callback: (
      datas: [R1],
      setPayload: UseApiFetcherHookReturnType<T2, R2>['setPayload']
    ) => void;
  };
  step3?: {
    api: UseApiFetcherHookReturnType<T3, R3>;
    callback: (
      datas: [R1, R2],
      setPayload: UseApiFetcherHookReturnType<T3, R3>['setPayload']
    ) => void;
  };
  step4?: {
    api: UseApiFetcherHookReturnType<T4, R4>;
    callback: (
      datas: [R1, R2, R3],
      setPayload: UseApiFetcherHookReturnType<T4, R4>['setPayload']
    ) => void;
  };
  step5?: {
    api: UseApiFetcherHookReturnType<T5, R5>;
    callback: (
      datas: [R1, R2, R3, R4],
      setPayload: UseApiFetcherHookReturnType<T5, R5>['setPayload']
    ) => void;
  };
};

export function useApiSequence<
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
>(props: UseApiSequenceProps<T1, R1, T2, R2, T3, R3, T4, R4, T5, R5>) {
  const isLoadingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const { step1, step2, step3, step4, step5 } = props;
  const [callbackInnerError, setCallbackInnerError] = useState<unknown>();

  const sequenceResultRef = useRef<SequenceResult>({
    step1: {
      isSuccess: false,
    },
  });
  const [sequenceResult, setSequenceResult] = useState<SequenceResult>();

  function changeIsLoading(v: boolean) {
    isLoadingRef.current = v;
    setIsLoading(v);
  }

  function start() {
    if (isLoadingRef.current) {
      console.warn('이미 로딩중 입니다.');
      return;
    }

    sequenceResultRef.current = {
      step1: {
        isSuccess: false,
      },
    };
    changeIsLoading(true);
    try {
      step1.callback(step1.api.setPayload);
    } catch (e) {
      sequenceResultRef.current = {
        step1: {
          isSuccess: false,
          error: e,
        },
      };
      changeIsLoading(false);
      setSequenceResult(sequenceResultRef.current);
      setCallbackInnerError(e);
    }
  }

  // api.result 처리
  useEffect(() => {
    if (step1.api.api.result === undefined) return;
    if (!isLoadingRef.current) return;

    sequenceResultRef.current.step1 = {
      isSuccess: true,
    };
    if (step2 !== undefined) {
      try {
        step2.callback(
          [
            step1.api.api.result.responsePayload!,
            // ...
          ],
          step2.api.setPayload
        );
      } catch (e) {
        sequenceResultRef.current.step2 = {
          isSuccess: false,
          error: e,
        };
        changeIsLoading(false);
        setSequenceResult(sequenceResultRef.current);
        setCallbackInnerError(e);
      }
    } else {
      changeIsLoading(false);
      setSequenceResult(sequenceResultRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step1.api.api.result]);

  useEffect(() => {
    if (step2?.api.api.result === undefined) return;
    if (!isLoadingRef.current) return;

    sequenceResultRef.current.step2 = {
      isSuccess: true,
    };
    if (step3 !== undefined) {
      try {
        step3.callback(
          [
            step1.api.api.result!.responsePayload!,
            step2!.api.api.result!.responsePayload!,
            // ...
          ],
          step3.api.setPayload
        );
      } catch (e) {
        sequenceResultRef.current.step3 = {
          isSuccess: false,
          error: e,
        };
        changeIsLoading(false);
        setSequenceResult(sequenceResultRef.current);
        setCallbackInnerError(e);
      }
    } else {
      changeIsLoading(false);
      setSequenceResult(sequenceResultRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step2?.api.api.result]);

  useEffect(() => {
    if (step3?.api.api.result === undefined) return;
    if (!isLoadingRef.current) return;

    sequenceResultRef.current.step3 = {
      isSuccess: true,
    };
    if (step4 !== undefined) {
      try {
        step4.callback(
          [
            step1.api.api.result!.responsePayload!,
            step2!.api.api.result!.responsePayload!,
            step3!.api.api.result!.responsePayload!,
            // ...
          ],
          step4.api.setPayload
        );
      } catch (e) {
        sequenceResultRef.current.step4 = {
          isSuccess: false,
          error: e,
        };
        changeIsLoading(false);
        setSequenceResult(sequenceResultRef.current);
        setCallbackInnerError(e);
      }
    } else {
      changeIsLoading(false);
      setSequenceResult(sequenceResultRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step3?.api.api.result]);

  useEffect(() => {
    if (step4?.api.api.result === undefined) return;
    if (!isLoadingRef.current) return;

    sequenceResultRef.current.step4 = {
      isSuccess: true,
    };
    if (step5 !== undefined) {
      try {
        step5.callback(
          [
            step1.api.api.result!.responsePayload!,
            step2!.api.api.result!.responsePayload!,
            step3!.api.api.result!.responsePayload!,
            step4!.api.api.result!.responsePayload!,
            // ...
          ],
          step5.api.setPayload
        );
      } catch (e) {
        sequenceResultRef.current.step5 = {
          isSuccess: false,
          error: e,
        };
        changeIsLoading(false);
        setSequenceResult(sequenceResultRef.current);
        setCallbackInnerError(e);
      }
    } else {
      changeIsLoading(false);
      setSequenceResult(sequenceResultRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step4?.api.api.result]);

  useEffect(() => {
    if (step5?.api.api.result === undefined) return;
    if (!isLoadingRef.current) return;

    sequenceResultRef.current.step5 = {
      isSuccess: true,
    };
    changeIsLoading(false);
    setSequenceResult(sequenceResultRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step5?.api.api.result]);

  // api error 처리
  useEffect(() => {
    if (step1.api.api.error === undefined) return;
    if (!isLoadingRef.current) return;
    sequenceResultRef.current.step1 = {
      isSuccess: false,
      error: step1.api.api.error,
    };
    changeIsLoading(false);
    setSequenceResult(sequenceResultRef.current);
  }, [step1.api.api.error]);

  useEffect(() => {
    if (step2?.api.api.error === undefined) return;
    if (!isLoadingRef.current) return;
    sequenceResultRef.current.step2 = {
      isSuccess: false,
      error: step2?.api.api.error,
    };
    changeIsLoading(false);
    setSequenceResult(sequenceResultRef.current);
  }, [step2?.api.api.error]);

  useEffect(() => {
    if (step3?.api.api.error === undefined) return;
    if (!isLoadingRef.current) return;
    sequenceResultRef.current.step3 = {
      isSuccess: false,
      error: step3?.api.api.error,
    };
    changeIsLoading(false);
    setSequenceResult(sequenceResultRef.current);
  }, [step3?.api.api.error]);

  useEffect(() => {
    if (step4?.api.api.error === undefined) return;
    if (!isLoadingRef.current) return;
    sequenceResultRef.current.step4 = {
      isSuccess: false,
      error: step4?.api.api.error,
    };
    changeIsLoading(false);
    setSequenceResult(sequenceResultRef.current);
  }, [step4?.api.api.error]);

  useEffect(() => {
    if (step5?.api.api.error === undefined) return;
    if (!isLoadingRef.current) return;
    sequenceResultRef.current.step5 = {
      isSuccess: false,
      error: step5?.api.api.error,
    };
    changeIsLoading(false);
    setSequenceResult(sequenceResultRef.current);
  }, [step5?.api.api.error]);

  return {
    isLoading,
    sequenceResult,
    start,
    callbackInnerError,
  };
}
