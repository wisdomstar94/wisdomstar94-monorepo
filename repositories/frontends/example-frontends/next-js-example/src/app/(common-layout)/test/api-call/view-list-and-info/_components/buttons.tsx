'use client';

import { useViewListAndInfo } from '@/api-fetcher-v2';

export function Buttons() {
  const viewListAndInfo = useViewListAndInfo({
    onSuccess(res) {
      console.log('@res', res);
    },
    onError(error) {
      console.log('@error', error);
    },
  });

  return (
    <>
      <div className={`inline-flex w-full flex-col gap-2 relative`}>
        <button
          disabled={viewListAndInfo.isLoading}
          className="inline-flex px-2 py-0.5 text-sm border border-slate-400 rounded-md cursor-pointer hover:bg-slate-100 disabled:opacity-50"
          onClick={async () => {
            if (viewListAndInfo.isLoadingRef.current) return;

            const inlineRes = await viewListAndInfo.getCaller().call({
              id: 21,
              size: 10,
              tag: '#client',
            });

            console.log('@inlineRes', inlineRes);
          }}
        >
          viewListAndInfo call!
        </button>

        <div className="w-full relative">
          <table>
            <tbody>
              <tr>
                <th>isLoading</th>
                <th>{String(viewListAndInfo.isLoading)}</th>
              </tr>
              <tr>
                <th>isLoadingOrMounting</th>
                <th>{String(viewListAndInfo.isLoadingOrMounting)}</th>
              </tr>
              <tr>
                <th>isResolved</th>
                <th>{String(viewListAndInfo.isResolved)}</th>
              </tr>
              <tr>
                <th>isMounted</th>
                <th>{String(viewListAndInfo.isMounted)}</th>
              </tr>
              <tr>
                <th>error</th>
                <th>{JSON.stringify(viewListAndInfo.error)}</th>
              </tr>
              <tr>
                <th>result</th>
                <th>{JSON.stringify(viewListAndInfo.result)}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
