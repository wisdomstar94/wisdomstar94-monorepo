import { TestListApiReqPayload } from './test-list-api.types';

export function testListApi(props: { payload: TestListApiReqPayload }) {
  const { payload } = props;
  return {
    url: `https://fake-json-api.mock.beeceptor.com/users${payload.params.id === 0 ? `aaa` : ''}`,
    method: 'GET' as const,
    payload,
  };
}
