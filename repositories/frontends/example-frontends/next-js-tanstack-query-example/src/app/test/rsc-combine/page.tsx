'use client';

import { TestListForm } from '@/components/test-list-form';

export default function Page() {
  return (
    <>
      <div className="w-full flex flex-col items-start gap-2 relative">
        <div className="text-3xl font-bold">test1</div>
        <TestListForm />
      </div>
    </>
  );
}
