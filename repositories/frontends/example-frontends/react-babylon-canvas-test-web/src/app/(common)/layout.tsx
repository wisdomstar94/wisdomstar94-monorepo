import { CommonRootLayout, ICommonRootLayout } from '@wisdomstar94/example-next-library';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menus: ICommonRootLayout.MenuItem[] = [{ name: 'test/glb-load-example', href: '/test/glb-load-example' }];
  return <CommonRootLayout menus={menus}>{children}</CommonRootLayout>;
}
