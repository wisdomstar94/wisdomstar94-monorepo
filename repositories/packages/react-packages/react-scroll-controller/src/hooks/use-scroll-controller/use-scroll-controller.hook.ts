import { getTargetElementFromElementSelector } from './use-scroll-controller.macro';
import { IUseScrollController } from './use-scroll-controller.types';
import styles from './use-scroll-controller.module.css';
import { useEffect, useRef, useState } from 'react';
import { subscribeElement } from '@wisdomstar94/vanilla-js-util';

export function useScrollController<T extends Element>(props?: IUseScrollController.Props) {
  const { isRestoreUnmounted = false } = props ?? {};

  const bodyObserver = useRef<MutationObserver | undefined>(undefined);
  const disabledScrollTargetElements = useRef<Array<IUseScrollController.ElementSelector<T>>>([]);
  const disabledTextDragTargetElements = useRef<Array<IUseScrollController.ElementSelector<T>>>([]);
  const [isWindowScrollPrevent, setIsWindowScrollPrevent] = useState(false);

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  function enableScroll(elementSelector: IUseScrollController.ElementSelector<T>) {
    const targetElement = getTargetElementFromElementSelector(elementSelector);
    if (targetElement === null) return;
    targetElement.classList.remove(styles['disable-scroll-not-overflow-hidden']);
    targetElement.classList.remove(styles['disable-scroll']);
    const latestScrollX = Number(targetElement.getAttribute('data-use-scroll-controller-latest-scroll-x'));
    const latestScrollY = Number(targetElement.getAttribute('data-use-scroll-controller-latest-scroll-y'));
    if (elementSelector.window === true) {
      document.documentElement.classList.remove(styles['disable-scroll-not-overflow-hidden']);
      document.body.classList.remove(styles['disable-scroll']);
      if (isIOS()) {
        document.body.style.removeProperty('width');
        document.body.style.removeProperty('top');
        document.body.style.removeProperty('left');
        document.body.style.removeProperty('position');
        window.scrollTo({
          top: latestScrollY,
          left: latestScrollX,
        });
      }
    }

    disabledScrollTargetElements.current = disabledScrollTargetElements.current.filter((item) => {
      return item.element === elementSelector.element || item.selector === elementSelector.selector;
    });
  }

  function enableTextDrag(elementSelector: IUseScrollController.ElementSelector<T>) {
    const targetElement = getTargetElementFromElementSelector(elementSelector);
    if (targetElement === null) return;
    targetElement.classList.remove(styles['disable-text-drag']);
    disabledTextDragTargetElements.current = disabledTextDragTargetElements.current.filter((item) => {
      return item.element === elementSelector.element || item.selector === elementSelector.selector;
    });
  }

  function disableScroll(elementSelector: IUseScrollController.ElementSelector<T>) {
    const targetElement = getTargetElementFromElementSelector(elementSelector);
    if (targetElement === null) return;
    disabledScrollTargetElements.current.push(elementSelector);

    // ios 대응
    let latestScrollX = 0;
    let latestScrollY = 0;
    if (elementSelector.window === true) {
      // targetElement.classList.add(styles['disable-scroll-not-overflow-hidden']);
      document.documentElement.classList.add(styles['disable-scroll-not-overflow-hidden']);
      document.body.classList.add(styles['disable-scroll']);
      latestScrollX = window.scrollX;
      latestScrollY = window.scrollY;
      // window.addEventListener('touchmove', (event) => {
      //   event.preventDefault();
      // });
      if (isIOS()) {
        document.body.style.width = '100vw';
        document.body.style.top = `-${latestScrollY}px`;
        document.body.style.left = `-${latestScrollX}px`;
        document.body.style.position = 'fixed';
      }
    } else {
      targetElement.classList.add(styles['disable-scroll']);
      latestScrollX = targetElement.scrollLeft;
      latestScrollY = targetElement.scrollTop;
    }

    // alert(`latestScrollX, latestScrollY => ${JSON.stringify({ latestScrollX, latestScrollY })}`);

    targetElement.setAttribute('data-use-scroll-controller-latest-scroll-x', latestScrollX.toString());
    targetElement.setAttribute('data-use-scroll-controller-latest-scroll-y', latestScrollY.toString());
  }

  function disableTextDrag(elementSelector: IUseScrollController.ElementSelector<T>) {
    const targetElement = getTargetElementFromElementSelector(elementSelector);
    if (targetElement === null) return;
    targetElement.classList.add(styles['disable-text-drag']);
    disabledTextDragTargetElements.current.push(elementSelector);
  }

  useEffect(() => {
    return () => {
      if (isRestoreUnmounted) {
        disabledScrollTargetElements.current.forEach((elementSelector) => {
          const targetElement = getTargetElementFromElementSelector(elementSelector);
          if (targetElement === null) return;
          targetElement.classList.remove(styles['disable-scroll']);
        });

        disabledTextDragTargetElements.current.forEach((elementSelector) => {
          const targetElement = getTargetElementFromElementSelector(elementSelector);
          if (targetElement === null) return;
          targetElement.classList.remove(styles['disable-text-drag']);
        });
      }
    };
  }, []);

  useEffect(() => {
    bodyObserver.current = subscribeElement({
      target: document.body,
      callback: (mutations) => {
        const isFixed = document.body.style.position === 'fixed';
        setIsWindowScrollPrevent(isFixed);

        if (!isFixed) {
          // const latestScrollX = Number(document.body.getAttribute('data-use-scroll-controller-latest-scroll-x'));
          // const latestScrollY = Number(document.body.getAttribute('data-use-scroll-controller-latest-scroll-y'));
          // alert(JSON.stringify({ latestScrollX, latestScrollY }));
          // window.scrollTo({
          //   top: latestScrollY !== 0 ? latestScrollY : undefined,
          //   left: latestScrollX !== 0 ? latestScrollX : undefined,
          // });
        }
      },
      options: {
        attributes: true,
      },
    });

    return () => {
      bodyObserver.current?.disconnect();
    };
  }, []);

  return {
    enableScroll,
    enableTextDrag,
    disableScroll,
    disableTextDrag,
    isWindowScrollPrevent,
  };
}
