import { cn } from '@/utils';
import { HiOutlineMenu } from 'react-icons/hi';

export function Topbar() {
  return (
    <>
      <header
        className={cn(
          'w-layout-topbar-width-m lg:w-layout-topbar-width',
          'h-layout-topbar-height-m lg:h-layout-topbar-height',
          'top-layout-topbar-top-m lg:top-layout-topbar-top',
          'left-layout-topbar-left-m lg:left-layout-topbar-left',
          'fixed transition-all duration-300',
          'bg-slate-400',
          'flex justify-between gap-2 px-4 box-border items-center'
        )}
      >
        {/* left */}
        <div className={cn('inline-flex items-center gap-2 relative')}>
          <button
            className={cn('p-2 cursor-pointer')}
            onClick={() => {
              document.body.classList.add('sidebar-opend');
              document.body.classList.remove('sidebar-collapsed');
            }}
          >
            <HiOutlineMenu className="text-xl" />
          </button>
        </div>

        {/* right */}
        <div></div>
      </header>
    </>
  );
}
