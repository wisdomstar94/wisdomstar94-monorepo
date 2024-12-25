'use client';

import { MainLayout } from '@/components/layouts/main-layout';
import Intro from '@/markdown/intro.mdx';

export default function Page() {
  return (
    <>
      <MainLayout>
        <Intro />
      </MainLayout>
    </>
  );
}
