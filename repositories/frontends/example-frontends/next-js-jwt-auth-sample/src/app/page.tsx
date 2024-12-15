'use client';

import { useUserInfoApi } from '@/hooks/api/use-user-info-api.hook';

export default function Page() {
  const userInfoApi = useUserInfoApi();

  return (
    <div>
      <button
        onClick={() => {
          userInfoApi.setPayload({});
        }}
      >
        fetch user info
      </button>
    </div>
  );
}
