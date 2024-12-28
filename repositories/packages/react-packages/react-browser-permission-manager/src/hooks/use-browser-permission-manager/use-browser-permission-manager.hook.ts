'use client';

import { useState } from 'react';
import type { IUseBrowserPermissionManager } from './use-browser-permission-manager.interface';

export function useBrowserPermissionManager(props?: IUseBrowserPermissionManager.Props) {
  const { requestMediaAudioPermissionCallback, requestMediaAudioPermissionError } = props ?? {};

  const [requestMediaAudioPermissionChecking, setRequestMediaAudioPermissionChecking] = useState(false);

  function requestMediaAudioPermission() {
    if (requestMediaAudioPermissionChecking) return;
    setRequestMediaAudioPermissionChecking(true);

    navigator.mediaDevices
      .getDisplayMedia({ audio: true })
      .then((result) => {
        if (typeof requestMediaAudioPermissionCallback === 'function') {
          requestMediaAudioPermissionCallback(result);
        }
      })
      .catch((error) => {
        if (typeof requestMediaAudioPermissionError === 'function') {
          requestMediaAudioPermissionError(error);
        }
      })
      .finally(() => {
        setRequestMediaAudioPermissionChecking(false);
      });
  }

  return {
    requestMediaAudioPermission,
    requestMediaAudioPermissionChecking,
  };
}
