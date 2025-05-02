'use server';

export type WrapServerActionResultReturnType<T extends (...args: never[]) => ReturnType<T>> =
  ReturnType<T> extends Promise<infer U> ? U : ReturnType<T>;

export async function wrapServerActionReturn<T extends (...args: never[]) => ReturnType<T>>(fn: T) {
  async function call(...args: Parameters<T>) {
    try {
      const res = fn(...args);
      const result = res instanceof Promise ? await res : res;
      return {
        result: result as WrapServerActionResultReturnType<T>,
      };
    } catch (e) {
      if (isPublicPossibleError(e)) {
        return {
          error: e,
        };
      }

      return {
        error: {
          name: 'UnknownError',
          message: 'Unknown error',
        },
      };
    }
  }

  return call;
}

function isPublicPossibleError(e: unknown): e is Error {
  return true;
}
