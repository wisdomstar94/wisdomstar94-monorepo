import { CommonRootLayout, ICommonRootLayout } from '@wisdomstar94/example-next-library';
import './globals.css';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menus: ICommonRootLayout.MenuItem[] = [{ name: 'test/clean-up', href: '/test/clean-up' }];
  return (
    <>
      <html lang="ko">
        <body>
          <CommonRootLayout menus={menus}>{children}</CommonRootLayout>
        </body>
      </html>
    </>
  );
}
