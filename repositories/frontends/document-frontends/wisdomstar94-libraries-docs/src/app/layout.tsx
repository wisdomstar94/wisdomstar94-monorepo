import type { Metadata } from 'next';
import { cn } from '@/utils';
import '../styles/globals.scss';

export const metadata: Metadata = {
  title: 'wisdomstar94-libraries',
  description: 'wisdomstar94-libraries',
  icons: {
    icon: '/wisdomstar94-monorepo/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body id="body" className={cn(`antialiased`, 'font-paperlogy-400-regular')}>
        {children}
      </body>
    </html>
  );
}
