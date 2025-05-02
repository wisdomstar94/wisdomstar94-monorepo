export type DefaultValues = {
  retryCount?: number;
  retryDelay?: number;
  loadingEndedBounceTime?: number;
};

export type CallOptions = {
  retryCount?: number;
  retryDelay?: number;
  loadingEndedBounceTime?: number;
};

export type ErrorCaseResult = { isError: false; error?: void } | { isError: true; error: unknown };

export type Props<T extends (...args: never[]) => Promise<Awaited<ReturnType<T>>>> = {
  asyncFn: T;
  defaultValues?: DefaultValues;
  noRetryCase?: (error: unknown) => boolean;

  onSuccessErrorCase?: (res: Awaited<ReturnType<T>>) => ErrorCaseResult;
  onSuccess?: (res: Awaited<ReturnType<T>>) => void;
  onError?: (error: unknown) => void;
};
