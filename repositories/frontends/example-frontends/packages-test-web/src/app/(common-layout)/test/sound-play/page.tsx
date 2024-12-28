'use client';

import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    setTimeout(() => {
      const audio = new Audio('/notification-1-270124.mp3');
      audio.play();
    }, 3000);
  }, []);

  return (
    <>
      소리 재생 테스트
      <button
        onClick={() => {
          const audio = new Audio('/notification-1-270124.mp3');
          audio.play();
        }}
      >
        play
      </button>
    </>
  );
}
