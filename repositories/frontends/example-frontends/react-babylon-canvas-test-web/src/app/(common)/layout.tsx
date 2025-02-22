import { CommonRootLayout, ICommonRootLayout } from '@wisdomstar94/example-next-library';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menus: ICommonRootLayout.MenuItem[] = [
    { name: 'test/glb-load-example', href: '/test/glb-load-example' },
    { name: 'test/create-mesh', href: '/test/create-mesh' },
    { name: 'test/rotate-animation', href: '/test/rotate-animation' },
    { name: 'test/logo-rotate-animation', href: '/test/logo-rotate-animation' },
    { name: 'test/mesh-mouse-event', href: '/test/mesh-mouse-event' },
  ];
  return <CommonRootLayout menus={menus}>{children}</CommonRootLayout>;
}
