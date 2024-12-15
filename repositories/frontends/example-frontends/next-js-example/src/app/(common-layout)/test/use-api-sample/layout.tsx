import { headers } from 'next/headers';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const headerStore = await headers();

  console.log(`headerStore.entries()`, Array.from(headerStore.entries()));

  return <>{children}</>;
}
