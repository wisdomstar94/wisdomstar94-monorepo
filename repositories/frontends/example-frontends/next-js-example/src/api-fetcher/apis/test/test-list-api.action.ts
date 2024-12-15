'use server';

import { apiFetcherAction } from '../../macros';
import { testListApi } from './';

export const testListApiAction = async (payload: Parameters<typeof testListApi>[0]['payload']) => {
  return await apiFetcherAction(testListApi, payload);
};
