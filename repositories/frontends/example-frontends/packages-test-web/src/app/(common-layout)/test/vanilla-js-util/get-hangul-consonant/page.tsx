'use client';

import { getHangulConsonant } from '@wisdomstar94/vanilla-js-util';
import { useEffect } from 'react';

export default function Page() {
  const strings = ['삼성전자', '아따맘마', '또한번', '쌍문동', '뷁뒑궭', '감자튀김', '해쉬브라운'];

  useEffect(() => {
    for (const string of strings) {
      const consonants = getHangulConsonant(string);
      console.log(`${string} =>`, consonants);
    }
  }, []);

  return <></>;
}
