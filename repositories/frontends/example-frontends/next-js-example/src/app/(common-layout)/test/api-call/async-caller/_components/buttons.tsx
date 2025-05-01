'use client';

import { useTestListApi } from '@/api-fetcher-v2';

export function Buttons() {
  const testListApi = useTestListApi({
    onSuccess(res) {
      console.log('@res', res);
      console.log('@res.result?.responsePayload', res.result?.responsePayload);
      // console.log('@res.responsePayload', res.responsePayload);
    },
    onError(error) {
      console.log('@error', error);
    },
  });

  return (
    <>
      <div className={`inline-flex w-full flex-col gap-2 relative`}>
        <button
          disabled={testListApi.isLoading}
          className="inline-flex px-2 py-0.5 text-sm border border-slate-400 rounded-md cursor-pointer hover:bg-slate-100 disabled:opacity-50"
          onClick={async () => {
            if (testListApi.isLoadingRef.current) return;

            const inlineRes = await testListApi.getCaller().call({
              payload: {
                params: {},
              },
            });

            console.log('@inlineRes', inlineRes);
            console.log('@inlineRes?.result?.responsePayload', inlineRes?.result?.responsePayload);
          }}
        >
          testListApi call!
        </button>

        <div className="w-full relative">
          <table>
            <tbody>
              <tr>
                <th>isLoading</th>
                <th>{String(testListApi.isLoading)}</th>
              </tr>
              <tr>
                <th>isLoadingOrMounting</th>
                <th>{String(testListApi.isLoadingOrMounting)}</th>
              </tr>
              <tr>
                <th>isResolved</th>
                <th>{String(testListApi.isResolved)}</th>
              </tr>
              <tr>
                <th>isMounted</th>
                <th>{String(testListApi.isMounted)}</th>
              </tr>
              <tr>
                <th>error</th>
                <th>{JSON.stringify(testListApi.error)}</th>
              </tr>
              <tr>
                <th>result</th>
                <th>{JSON.stringify(testListApi.result)}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
