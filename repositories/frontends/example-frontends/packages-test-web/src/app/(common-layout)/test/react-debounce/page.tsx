'use client';

import { useDebounce } from '@wisdomstar94/react-debounce';
import { useState } from 'react';

export default function Page() {
  const [search, setSearch] = useState<string>('');
  const searchDebounce = useDebounce({
    debounceTime: 500,
    fn: () => {
      console.log('@search', search);
    },
  });

  return (
    <div className={'flex flex-col gap-2 relative'}>
      <input
        type="type"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          searchDebounce.call();
        }}
        className="inline-flex border border-slate-500"
      />
      <div>{searchDebounce.isPending ? 'pending...' : ''}</div>
    </div>
  );
}
