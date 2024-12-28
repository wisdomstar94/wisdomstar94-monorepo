import Link from 'next/link';
import { ReactNode } from 'react';

// 백엔드 필요: yarn @wisdomstar94/test-epxress dev

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-col gap-2 relative">
      <ul className="w-full flex flex-wrap gap-2 relative">
        <Link
          className="inline-flex border border-slate-400 px-2 py-0.5 cursor-pointer"
          href="/test/next-fetch-cache/tab1"
        >
          탭 1
        </Link>
        <Link
          className="inline-flex border border-slate-400 px-2 py-0.5 cursor-pointer"
          href="/test/next-fetch-cache/tab2"
        >
          탭 2
        </Link>
        <Link
          className="inline-flex border border-slate-400 px-2 py-0.5 cursor-pointer"
          href="/test/next-fetch-cache/tab3"
        >
          탭 3
        </Link>
        <Link
          className="inline-flex border border-slate-400 px-2 py-0.5 cursor-pointer"
          href="/test/next-fetch-cache/tab4"
        >
          탭 4
        </Link>
      </ul>
      <div className="w-full relative block">{children}</div>
    </div>
  );
}
