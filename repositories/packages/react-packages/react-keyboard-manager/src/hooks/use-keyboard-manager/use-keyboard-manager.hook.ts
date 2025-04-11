import { useRef } from 'react';
import { IUseKeyboardManager } from './use-keyboard-manager.interface';
import { useAddEventListener } from '@wisdomstar94/react-add-event-listener';

export function useKeyboardManager(props?: IUseKeyboardManager.Props) {
  const keyMapRef = useRef<Map<string, boolean>>(new Map());

  const {
    onChangeKeyMapStatus,
    onUp,
    onDown,
    onLeft,
    onRight,
    onUpLeft,
    onUpRight,
    onDownLeft,
    onDownRight,
    onRelease,
    onJump,
  } = props ?? {};

  function onChangeKeyMapStatusMiddleware() {
    if (typeof onChangeKeyMapStatus === 'function') onChangeKeyMapStatus(keyMapRef.current);
    const keyMap = keyMapRef.current;
    const isUpPress = keyMap.get('ArrowUp');
    const isDownPress = keyMap.get('ArrowDown');
    const isLeftPress = keyMap.get('ArrowLeft');
    const isRightPress = keyMap.get('ArrowRight');
    const isJumpPress = keyMap.get(' ');

    if (isUpPress && !isDownPress && !isLeftPress && !isRightPress) {
      if (typeof onUp === 'function') onUp(keyMap);
    }
    if (!isUpPress && isDownPress && !isLeftPress && !isRightPress) {
      if (typeof onDown === 'function') onDown(keyMap);
    }
    if (!isUpPress && !isDownPress && isLeftPress && !isRightPress) {
      if (typeof onLeft === 'function') onLeft(keyMap);
    }
    if (!isUpPress && !isDownPress && !isLeftPress && isRightPress) {
      if (typeof onRight === 'function') onRight(keyMap);
    }
    if (isUpPress && !isDownPress && isLeftPress && !isRightPress) {
      if (typeof onUpLeft === 'function') onUpLeft(keyMap);
    }
    if (isUpPress && !isDownPress && !isLeftPress && isRightPress) {
      if (typeof onUpRight === 'function') onUpRight(keyMap);
    }
    if (!isUpPress && isDownPress && isLeftPress && !isRightPress) {
      if (typeof onDownLeft === 'function') onDownLeft(keyMap);
    }
    if (!isUpPress && isDownPress && !isLeftPress && isRightPress) {
      if (typeof onDownRight === 'function') onDownRight(keyMap);
    }
    if (!isUpPress && !isDownPress && !isLeftPress && !isRightPress) {
      if (typeof onRelease === 'function') onRelease(keyMap);
    }
    if (isJumpPress) {
      if (typeof onJump === 'function') onJump(keyMap);
    }
  }

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'blur',
      eventListener(event) {
        keyMapRef.current.clear();
        onChangeKeyMapStatusMiddleware();
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'keyup',
      eventListener(event) {
        const key = event.key;
        keyMapRef.current.set(key, false);
        onChangeKeyMapStatusMiddleware();
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'keydown',
      eventListener(event) {
        const key = event.key;
        keyMapRef.current.set(key, true);
        onChangeKeyMapStatusMiddleware();
      },
    },
  });
}
