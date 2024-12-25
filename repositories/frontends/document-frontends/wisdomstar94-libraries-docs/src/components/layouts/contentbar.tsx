import { cn } from '@/utils';
import { ReactNode } from 'react';

export type ContentbarProps = {
  children: ReactNode;
};

export function Contentbar(props: ContentbarProps) {
  const { children } = props;

  return (
    <>
      <main
        className={cn(
          'markdown-body',
          'w-layout-contentbar-width-m lg:w-layout-contentbar-width',
          'h-layout-contentbar-height-m lg:h-layout-contentbar-height',
          'top-layout-contentbar-top-m lg:top-layout-contentbar-top',
          'left-layout-contentbar-left-m lg:left-layout-contentbar-left',
          'fixed transition-all duration-300',
          'overflow-y-auto',
          // 'bg-blue-400',
          'p-6 box-border'
        )}
      >
        {children}
      </main>
    </>
  );
}
