import { testListApi } from './test-list-api';
// import { testListApiServerAction } from './test-list-api.server-action';

export function testListApiQueryFn(payload: Parameters<typeof testListApi>[0]) {
  return async () => {
    const { data, error } = await testListApi(payload);
    if (error) {
      throw error;
    }
    return data;
  };
}
