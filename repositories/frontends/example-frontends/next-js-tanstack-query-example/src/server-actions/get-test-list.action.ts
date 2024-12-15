'use server';

type CommonReturn<T> = {
  error?: unknown;
  data?: T;
};

type TestListRes = {
  timestamp: number;
  data: {
    name: string;
    age: number;
    timestamp: number;
  }[];
};

export async function getTestList(): Promise<CommonReturn<TestListRes>> {
  try {
    const response = await fetch(`http://localhost:3030/api/test/list2`);
    const body = (await response.json()) as TestListRes;
    return {
      data: body,
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: {
          name: e.name,
          message: e.message,
          // stack: e.stack,
          // cause: e.cause,
        },
      };
    }

    return {
      error: JSON.stringify(e),
    };
  }
}
