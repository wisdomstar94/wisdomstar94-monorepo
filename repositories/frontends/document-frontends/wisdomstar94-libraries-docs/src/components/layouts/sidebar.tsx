import { cn } from '@/utils';

export function Sidebar() {
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

          'fixed z-[2] transition-all duration-300',
          'bg-slate-100'
        )}
      ></aside>
    </>
  );
}
