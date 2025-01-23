import { ReactNode } from 'react';
import { getDateAgoPeriod } from './date-util-v2';

export default function Layout({ children }: { children: ReactNode }) {
  const { startDateIsoString, endDateIsoString } = getDateAgoPeriod({ days: 1 });

  console.log(`startDateIsoString, endDateIsoString`, { startDateIsoString, endDateIsoString });

  return <>{children}</>;
}
