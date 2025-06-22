import { createPublicError, isPublicError, PublicError } from './public-error';

export function createServerActionFn<T extends (...args: never[]) => ReturnType<T>>(props: { fn: T }) {
  const { fn } = props;

  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | PublicError> => {
    try {
      const result = fn(...args);
      const value = result instanceof Promise ? await result : result;
      return value as Awaited<ReturnType<T>>;
    } catch (error) {
      let errorStore = error;

      if (error instanceof Response) {
        const body = await (async () => {
          try {
            return await error.clone().json();
          } catch (e) {
            return await error.clone().text();
          }
        })();
        errorStore = body;
      }

      if (isPublicError(error)) {
        return error;
      }

      const uuid = Date.now().toString();
      console.error(`[${uuid}] error`, error);
      return createPublicError({
        errorCode: uuid,
        message: '서버에서 에러가 발생하였습니다.',
      });
    }
  };
}
