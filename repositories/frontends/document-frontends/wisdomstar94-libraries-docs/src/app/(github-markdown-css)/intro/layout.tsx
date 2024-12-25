import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'wisdomstar94 libraries - 소개',
  description: 'wisdomstar94 libraries를 소개합니다.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
