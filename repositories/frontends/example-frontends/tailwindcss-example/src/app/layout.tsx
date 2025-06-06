import type { Metadata } from "next";
import "./globals.scss";
import { CommonRootLayout, ICommonRootLayout } from "@wisdomstar94/example-next-library";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menus: ICommonRootLayout.MenuItem[] = [
    { name: "/test/basic", href: "/test/basic" },
    { name: "/test/static-variant", href: "/test/static-variant" }, // https://tailwindcss.com/docs/plugins#static-variants
    { name: "/test/dynamic-variant", href: "/test/dynamic-variant" }, // https://tailwindcss.com/docs/plugins#dynamic-variants
    { name: "/test/static-utilities", href: "/test/static-utilities" }, // https://tailwindcss.com/docs/plugins#static-utilities
    { name: "/test/dynamic-utilities", href: "/test/dynamic-utilities" }, // https://tailwindcss.com/docs/plugins#dynamic-utilities
    { name: "/test/components", href: "/test/components" }, // https://tailwindcss.com/docs/plugins#adding-components
    { name: "/test/base", href: "/test/base" }, // https://tailwindcss.com/docs/plugins#adding-base-styles
    { name: "/test/fonts", href: "/test/fonts" },
    { name: "/test/grid-layout", href: "/test/grid-layout" },
    { name: "/test/flexbox-test", href: "/test/flexbox-test" },
    { name: "/test/sticky-test", href: "/test/sticky-test" },
  ];

  return (
    <html lang="ko">
      <body>
        <CommonRootLayout menus={menus}>{children}</CommonRootLayout>
      </body>
    </html>
  );
}
