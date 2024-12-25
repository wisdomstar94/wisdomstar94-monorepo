import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '@wisdomstar94/react-add-event-listener',
  description: '@wisdomstar94/react-add-event-listener 라이브러리를 소개합니다.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
