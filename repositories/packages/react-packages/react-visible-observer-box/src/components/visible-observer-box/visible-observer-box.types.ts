import { ReactNode } from 'react';

export type Props = {
  customKey: string | number;
  index: number;
  className?: string;
  children: ReactNode;
  options?: IntersectionObserverInit;
  onChangeVisibility?: (isVisible: boolean) => void;
};
