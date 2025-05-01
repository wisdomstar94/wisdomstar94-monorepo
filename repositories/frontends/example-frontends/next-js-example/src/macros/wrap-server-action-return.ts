export async function wrapServerActionReturn<T extends (...args: never[]) => ReturnType<T>>(fn: T) {
  async function call(...args: Parameters<T>) {
    try {
      const res = fn(...args);
      return {
        result: res instanceof Promise ? await res : res,
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
  return e instanceof Error;
}
