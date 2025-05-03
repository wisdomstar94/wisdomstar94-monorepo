'use server';

import { countErrorApiServer, testListApiServer } from '@/api-fetcher-v2';

export const viewListAndInfoServer = async (props: { id: number; size: number; tag: string }) => {
  const { id, size, tag } = props;

  const listResult = await testListApiServer({
    payload: {
      params: {},
    },
  });
  const list = listResult.responsePayload;

  const infoResult = await countErrorApiServer({
    payload: {
      headers: {},
    },
  });
  const info = infoResult.responsePayload;

  return {
    list,
    info,
    params: {
      id,
      size,
      tag,
    },
  };
};
