'use client';

export function useAsyncCallerErrorHandler() {
  function onError(error: unknown) {
    console.log('@useAsyncCallerErrorHandler.error', error);
  }

  return {
    onError,
  };
}
