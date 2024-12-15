import { isMyError } from '@/macro';
import { CommonReturn, TestListApiReqPayload, TestListRes } from '@/types';

export async function testListApi(payload: TestListApiReqPayload): Promise<CommonReturn<TestListRes>> {
  console.log('@payload', payload);
  try {
    const response = await fetch(`http://localhost:3030/api/test/list?id=${payload.params.id}&name=${payload.query.name}`);
    const body = (await response.json()) as TestListRes;
    throw { myErrorName: 'zzz' };
    return {
      data: body,
    };
  } catch (e) {
    console.log('에러 발생', e);

    if (isMyError(e)) {
      return {
        error: e,
      };
    }

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
      error: {
        name: 'unkown error',
        message: JSON.stringify(e),
      },
    };
  }
}
