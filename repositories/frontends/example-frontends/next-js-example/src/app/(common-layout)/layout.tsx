import { CommonRootLayout, ICommonRootLayout } from '@wisdomstar94/example-next-library';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menus: ICommonRootLayout.MenuItem[] = [
    { name: 'test/use-id', href: '/test/use-id' },
    { name: 'test/use-transition/yes', href: '/test/use-transition/yes' },
    { name: 'test/use-transition/no', href: '/test/use-transition/no' },
    { name: 'test/use-transition/with-suspense', href: '/test/use-transition/with-suspense' },
    { name: 'test/use-layout-effect', href: '/test/use-layout-effect' },
    { name: 'test/use-layout-effect2', href: '/test/use-layout-effect2' },
    { name: 'test/use-sync-external-store', href: '/test/use-sync-external-store' },
    { name: 'test/use-reducer/basic', href: '/test/use-reducer/basic' },
    { name: 'test/use-optimistic', href: '/test/use-optimistic' },

    { name: 'test/server-action/basic', href: '/test/server-action/basic' },
    { name: 'test/server-action/server-function-wrapper', href: '/test/server-action/server-function-wrapper' },

    { name: 'test/api-call/basic', href: '/test/api-call/basic' },
    { name: 'test/api-call/async-caller', href: '/test/api-call/async-caller' },
    { name: 'test/api-call/count-error', href: '/test/api-call/count-error' },
    { name: 'test/api-call/view-list-and-info', href: '/test/api-call/view-list-and-info' },

    { name: 'test/parallel-routes-and-intercepting-routes', href: '/test/parallel-routes-and-intercepting-routes' },
    { name: 'test/image-response', href: '/test/image-response' },
    { name: 'test/route-segment-config-test/page1', href: '/test/route-segment-config-test/page1' },
    { name: 'test/route-segment-config-test/page2', href: '/test/route-segment-config-test/page2' },
    { name: 'test/template-test-page-1', href: '/test/template-test-page-1' },
    { name: 'test/template-test-page-2', href: '/test/template-test-page-2' },
    { name: 'test/template-test-page-3/t1/t2', href: '/test/template-test-page-3/t1/t2' },
    { name: 'test/winston', href: '/test/winston' },
    { name: 'test/cache/page1', href: '/test/cache/page1' },
    { name: 'test/cache/page2', href: '/test/cache/page2' },
    { name: 'test/server-component/test1', href: '/test/server-component/test1' },
    { name: 'test/search-params', href: '/test/search-params' },
    { name: 'test/client-top', href: '/test/client-top' },
    { name: 'test/client-top2', href: '/test/client-top2' },
    { name: 'test/tailwindcss-container', href: '/test/tailwindcss-container' },
    { name: 'test/scss', href: '/test/scss' },

    { name: 'test/server-to-client-setcookie', href: '/test/server-to-client-setcookie' },
    { name: 'test/use-api-sample', href: '/test/use-api-sample' },
    { name: 'test/next-fetch-cache', href: '/test/next-fetch-cache' },

    { name: 'test2', href: '/test2' },
    { name: 'test2/t1', href: '/test2/t1' },
  ];

  return <CommonRootLayout menus={menus}>{children}</CommonRootLayout>;
}
