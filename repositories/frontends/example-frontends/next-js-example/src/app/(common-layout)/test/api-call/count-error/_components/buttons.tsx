'use client';

import { useCountErrorApi } from '@/api-fetcher-v2';

export function Buttons() {
  const countErrorApi = useCountErrorApi({
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
          disabled={countErrorApi.isLoading}
          className="inline-flex px-2 py-0.5 text-sm border border-slate-400 rounded-md cursor-pointer hover:bg-slate-100 disabled:opacity-50"
          onClick={async () => {
            if (countErrorApi.isLoadingRef.current) return;

            const inlineRes = await countErrorApi.getCaller().call({
              payload: {
                headers: {
                  'My-Header-Key': 'from client...',
                },
              },
            });

            console.log('@inlineRes', inlineRes);
            // console.log('@inlineRes?.responsePayload', inlineRes?.responsePayload);
            console.log('@inlineRes?.result?.responsePayload', inlineRes?.result?.responsePayload);
          }}
        >
          countErrorApi call!
        </button>

        <div className="w-full relative">
          <table>
            <tbody>
              <tr>
                <th>isLoading</th>
                <th>{String(countErrorApi.isLoading)}</th>
              </tr>
              <tr>
                <th>isLoadingOrMounting</th>
                <th>{String(countErrorApi.isLoadingOrMounting)}</th>
              </tr>
              <tr>
                <th>isResolved</th>
                <th>{String(countErrorApi.isResolved)}</th>
              </tr>
              <tr>
                <th>isMounted</th>
                <th>{String(countErrorApi.isMounted)}</th>
              </tr>
              <tr>
                <th>error</th>
                <th>{JSON.stringify(countErrorApi.error)}</th>
              </tr>
              <tr>
                <th>result</th>
                <th>{JSON.stringify(countErrorApi.result)}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
