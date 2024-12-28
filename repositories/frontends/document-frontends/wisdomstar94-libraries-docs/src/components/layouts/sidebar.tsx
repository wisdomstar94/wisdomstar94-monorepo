import { cn } from '@/utils';
import { Logo } from '../logo';
import { SIDE_MENU_LIST } from '@/consts/side-menu-list.const';
// import { FaCircleDot } from 'react-icons/fa6';
import { FaRegCircleDot } from 'react-icons/fa6';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  console.log('@pathname', pathname);

  return (
    <>
      <div
        className={cn(
          'w-0 h-0 overflow-hidden z-[2] top-0 left-0 fixed bg-black/75',
          'sidebar-opend:animate-appear sidebar-collapsed:animate-dissapear'
        )}
        onClick={() => {
          document.body.classList.remove('sidebar-opend');
          document.body.classList.add('sidebar-collapsed');
        }}
      />

      <aside
        className={cn(
          'w-layout-sidebar-width-m lg:w-layout-sidebar-width',
          'h-layout-sidebar-height-m lg:h-layout-sidebar-height',
          'top-layout-sidebar-top-m lg:top-layout-sidebar-top',
          'left-layout-sidebar-left-m lg:left-layout-sidebar-left',
          'max-w-layout-sidebar-max-width-m lg:max-w-layout-sidebar-max-width',
          'sidebar-opend:left-0',
          'flex flex-col gap-2',
          'overflow-y-auto',
          'fixed z-[2] transition-all duration-300',
          'bg-slate-100'
        )}
      >
        <div className={cn('w-full flex items-center justify-center p-4 box-border')}>
          <Logo />
        </div>
        <ul className={cn('w-full flex flex-col gap-0 relative box-border')}>
          {SIDE_MENU_LIST.map((item) => {
            return (
              <li
                key={item.href}
                className={cn('inline-flex w-full relative box-border', 'group/menu-item')}
                data-active={pathname.startsWith(item.href)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'inline-flex w-full box-border cursor-pointer hover:bg-slate-200 items-center gap-4 p-2',
                    'group-data-[active=true]/menu-item:bg-slate-200 group-data-[active=true]/menu-item:hover:bg-slate-300'
                  )}
                >
                  {/* <LuDot /> */}
                  <FaRegCircleDot className={cn('flex-shrink-0 flex-grow-0')} />
                  <div className={cn('w-full min-w-0 relative break-all text-left text-sm tracking-tight')}>
                    {item.label}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
