import { testListApi } from './test-list-api';

export const testListApiQueryKey = (params: Parameters<typeof testListApi>[0]['params']): string[] => {
  return ['api', 'test', 'list', params.id.toString()];
};
export const testListApiStaleTime = 1000 * 3;
