import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '@wisdomstar94/react-api-again-request-scheduler',
  description: '@wisdomstar94/react-api-again-request-scheduler 라이브러리를 소개합니다.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
