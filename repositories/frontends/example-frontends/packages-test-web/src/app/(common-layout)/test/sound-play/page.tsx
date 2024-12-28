'use client';

import { useBrowserPermissionManager } from '@wisdomstar94/react-browser-permission-manager';
import { usePromiseInterval } from '@wisdomstar94/react-promise-interval';
import { useEffect, useRef } from 'react';

export default function Page() {
  // const audioRef = useRef<HTMLAudioElement>(null);

  const browserPermissionManager = useBrowserPermissionManager({
    requestMediaAudioPermissionCallback(mediaStream) {
      console.log('#requestMediaAudioPermissionCallback', mediaStream);
    },
    requestMediaAudioPermissionError(error) {
      console.log('#requestMediaAudioPermissionError', error);
    },
  });

  usePromiseInterval({
    isAutoStart: true,
    fn: async () => {
      const audio = new Audio('/notification-1-270124.mp3');
      audio.play();
    },
    intervalTime: 2000,
  });

  return (
    <>
      소리 재생 테스트
      {/* <audio src="/notification-1-270124.mp3" ref={audioRef} autoPlay></audio> */}
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
