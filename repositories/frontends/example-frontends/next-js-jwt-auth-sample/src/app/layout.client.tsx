'use client';

import { userInfo } from '@/server-actions/user-info';

export function RootLayoutClient() {
  return (
    <div className="w-full flex flex-wrap gap-2 relative">
      <button
        onClick={() => {
          userInfo().then((res) => {
            console.log('@server action userInfo res', res);
          });
        }}
      >
        server action call
      </button>
    </div>
  );
}
