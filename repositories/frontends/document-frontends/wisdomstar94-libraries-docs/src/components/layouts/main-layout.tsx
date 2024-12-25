import { ReactNode } from 'react';
import { Topbar } from './topbar';
import { Sidebar } from './sidebar';
import { Contentbar } from './contentbar';

export type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout(props: MainLayoutProps) {
  const { children } = props;
  return (
    <>
      <Topbar />
      <Sidebar />
      <Contentbar>{children}</Contentbar>
    </>
  );
}
