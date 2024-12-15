import { getHangulConsonant } from '@wisdomstar94/vanilla-js-util';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const consonants = getHangulConsonant('ppp');
  const consonantsFirst = consonants[0];

  console.log('char =>', consonantsFirst);
  console.log(`'ㄱ'.localeCompare(char) =>`, 'ㄱ'.localeCompare(consonantsFirst));

  return <>{children}</>;
}
