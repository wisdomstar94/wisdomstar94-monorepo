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
    { name: 'test/glow-layer', href: '/test/glow-layer' },
    { name: 'test/havok-test', href: '/test/havok-test' },
    { name: 'test/havok-simple-controll-with-apply-force', href: '/test/havok-simple-controll-with-apply-force' },
    {
      name: 'test/havok-simple-controll-with-set-target-transform',
      href: '/test/havok-simple-controll-with-set-target-transform',
    },
    {
      name: 'test/havok-character-controller-test',
      href: '/test/havok-character-controller-test',
    },
  ];
  return <CommonRootLayout menus={menus}>{children}</CommonRootLayout>;
}
