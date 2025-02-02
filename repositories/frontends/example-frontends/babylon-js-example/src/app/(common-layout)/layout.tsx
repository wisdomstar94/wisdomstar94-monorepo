import { CommonRootLayout, ICommonRootLayout } from '@wisdomstar94/example-next-library';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menus: ICommonRootLayout.MenuItem[] = [
    // { name: 'test/other-character-add', href: '/test/other-character-add' },
    // { name: 'test/socket-apply', href: '/test/socket-apply' },
    { name: 'test/socket-apply-v3', href: '/test/socket-apply-v3' },
    { name: 'test/texture-text', href: '/test/texture-text' },
    { name: 'test/logo-3d-animation', href: '/test/logo-3d-animation' },
  ];

  return <CommonRootLayout menus={menus}>{children}</CommonRootLayout>;
}
