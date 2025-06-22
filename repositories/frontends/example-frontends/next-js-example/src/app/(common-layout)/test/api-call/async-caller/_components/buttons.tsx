'use client';

import { useCountErrorApi } from '@/api-fetcher';

export function Buttons() {
  const countErrorApi = useCountErrorApi();

  return (
    <>
      <div className={`inline-flex w-full flex-col gap-2 relative`}>
        <button
          disabled={countErrorApi.isLoading}
          className="inline-flex px-2 py-0.5 text-sm border border-slate-400 rounded-md cursor-pointer hover:bg-slate-100 disabled:opacity-50"
          onClick={async () => {
            if (countErrorApi.isLoading) return;

            const { result, error } = await countErrorApi.call({
              payload: {
                headers: {
                  'My-Header-Key': 'from client... 2',
                },
              },
            });

            console.log('#result', result);
            console.log('#error', error);
          }}
        >
          testListApi call!
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
