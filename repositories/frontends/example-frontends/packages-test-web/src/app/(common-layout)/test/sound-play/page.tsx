'use client';

import { useBrowserPermissionManager } from '@wisdomstar94/react-browser-permission-manager';
import { useEffect, useRef } from 'react';

export default function Page() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const browserPermissionManager = useBrowserPermissionManager({
    requestMediaAudioPermissionCallback(mediaStream) {
      console.log('#requestMediaAudioPermissionCallback', mediaStream);
    },
    requestMediaAudioPermissionError(error) {
      console.log('#requestMediaAudioPermissionError', error);
    },
  });

  useEffect(() => {
    // browserPermissionManager.requestMediaAudioPermission();
    // setTimeout(() => {
    // const audio = new Audio('/notification-1-270124.mp3');
    // audio.muted = true;
    // audio.play().then(() => {
    //   // audio.muted = false;
    // });
    // }, 3000);
    audioRef.current?.play();
  }, []);

  return (
    <>
      소리 재생 테스트
      <audio src="/notification-1-270124.mp3" ref={audioRef} autoPlay></audio>
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
