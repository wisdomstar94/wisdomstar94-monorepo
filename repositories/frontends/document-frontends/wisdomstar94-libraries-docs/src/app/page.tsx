import { cn } from '@/utils';
import Link from 'next/link';

export default function Page() {
  return (
    <main
      className={cn(
        'w-full h-full fixed top-0 left-0',
        'flex items-center justify-center',
        'bg-slate-100'
        //...
      )}
    >
      <div className={cn('inline-flex items-center justify-center gap-3 relative flex-col')}>
        <div className={cn('font-paperlogy-700-bold px-4 text-center break-keep', 'text-xl sm:text-3xl')}>
          @wisdomstar94 libraries
        </div>
        <div className={cn('text-slate-700 px-4 text-center break-all')}>
          다양한 라이브러리를 개발 및 배포, 유지보수 하고 있습니다.
        </div>
        <Link
          href="/intro"
          className={cn(
            'mt-4',
            'rounded-full inline-flex px-6 py-3 cursor-pointer',
            'bg-slate-500 text-white hover:bg-slate-600'
          )}
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
