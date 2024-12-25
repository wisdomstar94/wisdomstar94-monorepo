'use client';

import { MainLayout } from '@/components/layouts/main-layout';
import ReactAddEventListener from '@/markdown/react-add-event-listener.mdx';

export default function Page() {
  return (
    <>
      <MainLayout>
        <ReactAddEventListener />
      </MainLayout>
    </>
  );
}
