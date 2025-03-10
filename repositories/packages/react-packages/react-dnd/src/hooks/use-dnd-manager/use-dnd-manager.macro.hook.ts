import { useEffect, useRef, useState } from 'react';
import { IUseDndManager } from './use-dnd-manager.interface';
import { getMaxScrollValues, getPointerDownedCoordinate, isContainCoordinate } from '@wisdomstar94/vanilla-js-util';
import { getCursoredTargetList } from './use-dnd-manager.macro';
import { getTargetElementFromElementSelector } from '@wisdomstar94/react-scroll-controller';
import { useRequestAnimationFrameManager } from '@wisdomstar94/react-request-animation-frame-manager';

export function useListEdgeScrollController() {
  const prevEdgeScrollType = useRef<IUseDndManager.EdgeScrollType | undefined>(undefined);
  const [currentEdgeScrollType, setCurrentEdgeScrollType] = useState<IUseDndManager.EdgeScrollType>();
  const scrollValueAddOrMinus = 10;
  const onScrolledRef = useRef<() => void | undefined>(undefined);
  const snapshotMaxScrollValues = useRef<ReturnType<typeof getMaxScrollValues>>({
    maxScrollTop: 0,
    maxScrollLeft: 0,
  });

  function disposeListEdgeScroll<T extends string, E extends HTMLElement, K>(
    event: MouseEvent | TouchEvent,
    pointerDownedInfoRef: IUseDndManager.PointerDownedInfo<T, E, K>,
    onScrolled?: () => void
  ) {
    onScrolledRef.current = onScrolled;
    const virtualWidth = 20;
    const virtualHeight = 20;
    const [cursorX, cursorY] = getPointerDownedCoordinate(event);
    const cursoredTargetList = getCursoredTargetList(pointerDownedInfoRef, [cursorX, cursorY]);

    const checkWindow = () => {
      const isTopArea = isContainCoordinate([cursorX, cursorY], {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: virtualHeight,
      });
      const isBottomArea = isContainCoordinate([cursorX, cursorY], {
        x: 0,
        y: window.innerHeight - virtualHeight,
        width: window.innerWidth,
        height: virtualHeight,
      });

      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
      const maxScrollLeft = document.documentElement.scrollWidth - window.innerWidth;

      if (isTopArea) {
        setCurrentEdgeScrollType({
          type: 'window',
          direction: 'top',
        });
        if (prevEdgeScrollType.current?.type !== 'window' && prevEdgeScrollType.current?.direction !== 'top') {
          snapshotMaxScrollValues.current = {
            maxScrollTop,
            maxScrollLeft,
          };
        }
      } else if (isBottomArea) {
        setCurrentEdgeScrollType({
          type: 'window',
          direction: 'bottom',
        });
        if (prevEdgeScrollType.current?.type !== 'window' && prevEdgeScrollType.current?.direction !== 'top') {
          snapshotMaxScrollValues.current = {
            maxScrollTop,
            maxScrollLeft,
          };
        }
      } else {
        disposeListEdgeScrollEnd();
      }
    };

    const cursoredTargetListScrollContainerElement = getTargetElementFromElementSelector(
      cursoredTargetList?.scrollContainerElementSelector
    );
    if (cursoredTargetListScrollContainerElement === null) {
      checkWindow();
      return;
    }

    const rect = cursoredTargetListScrollContainerElement.getBoundingClientRect();

    switch (cursoredTargetList?.listType.type) {
      case 'grid':
      case 'one-col':
        {
          const isTopArea = isContainCoordinate([cursorX, cursorY], {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: virtualHeight,
          });
          const isBottomArea = isContainCoordinate([cursorX, cursorY], {
            x: rect.x,
            y: rect.y + rect.height - virtualHeight,
            width: rect.width,
            height: virtualHeight,
          });

          const { maxScrollLeft, maxScrollTop } = getMaxScrollValues(cursoredTargetListScrollContainerElement);

          if (isTopArea) {
            setCurrentEdgeScrollType({
              type: 'element',
              direction: 'top',
              element: cursoredTargetListScrollContainerElement,
            });
            if (prevEdgeScrollType.current?.type !== 'element' && prevEdgeScrollType.current?.direction !== 'top') {
              snapshotMaxScrollValues.current = {
                maxScrollLeft,
                maxScrollTop,
              };
            }
          } else if (isBottomArea) {
            setCurrentEdgeScrollType({
              type: 'element',
              direction: 'bottom',
              element: cursoredTargetListScrollContainerElement,
            });
            if (prevEdgeScrollType.current?.type !== 'element' && prevEdgeScrollType.current?.direction !== 'bottom') {
              snapshotMaxScrollValues.current = {
                maxScrollLeft,
                maxScrollTop,
              };
            }
          } else {
            checkWindow();
          }
        }
        break;
      case 'one-row':
        {
          const isLeftArea = isContainCoordinate([cursorX, cursorY], {
            x: rect.x,
            y: rect.y,
            width: virtualWidth,
            height: rect.height,
          });
          const isRightArea = isContainCoordinate([cursorX, cursorY], {
            x: rect.x + rect.width - virtualWidth,
            y: rect.y,
            width: virtualWidth,
            height: rect.height,
          });

          const { maxScrollTop, maxScrollLeft } = getMaxScrollValues(cursoredTargetListScrollContainerElement);

          if (isLeftArea) {
            setCurrentEdgeScrollType({
              type: 'element',
              direction: 'left',
              element: cursoredTargetListScrollContainerElement,
            });
            if (prevEdgeScrollType.current?.type !== 'element' && prevEdgeScrollType.current?.direction !== 'left') {
              snapshotMaxScrollValues.current = {
                maxScrollLeft,
                maxScrollTop,
              };
            }
          } else if (isRightArea) {
            setCurrentEdgeScrollType({
              type: 'element',
              direction: 'right',
              element: cursoredTargetListScrollContainerElement,
            });
            if (prevEdgeScrollType.current?.type !== 'element' && prevEdgeScrollType.current?.direction !== 'right') {
              snapshotMaxScrollValues.current = {
                maxScrollLeft,
                maxScrollTop,
              };
            }
          } else {
            checkWindow();
          }
        }
        break;
    }
  }

  function disposeListEdgeScrollEnd() {
    setCurrentEdgeScrollType(undefined);
  }

  useRequestAnimationFrameManager({
    isAutoStart: true,
    callback(startedTimestamp, currentTimestamp, step) {
      if (currentEdgeScrollType === undefined) return;

      const snapshotMaxScrollValuesRef = snapshotMaxScrollValues.current;
      if (snapshotMaxScrollValuesRef === undefined) return;

      const { maxScrollTop, maxScrollLeft } = snapshotMaxScrollValuesRef;

      if (currentEdgeScrollType.type === 'window') {
        switch (currentEdgeScrollType.direction) {
          case 'top':
            {
              const top = window.scrollY - scrollValueAddOrMinus;
              window.scrollTo({
                top,
              });
            }
            break;
          case 'bottom':
            {
              const top = window.scrollY + scrollValueAddOrMinus;
              window.scrollTo({
                top: top > maxScrollTop ? maxScrollTop : top,
              });
            }
            break;
        }
      } else if (currentEdgeScrollType.type === 'element') {
        switch (currentEdgeScrollType.direction) {
          case 'top':
            {
              const top = currentEdgeScrollType.element.scrollTop - scrollValueAddOrMinus;
              currentEdgeScrollType.element.scrollTo({
                top,
              });
            }
            break;
          case 'bottom':
            {
              const top = currentEdgeScrollType.element.scrollTop + scrollValueAddOrMinus;
              currentEdgeScrollType.element.scrollTo({
                top: top > maxScrollTop ? maxScrollTop : top,
              });
            }
            break;
          case 'left':
            {
              const left = currentEdgeScrollType.element.scrollLeft - scrollValueAddOrMinus;
              currentEdgeScrollType.element.scrollTo({
                left,
              });
            }
            break;
          case 'right':
            {
              const left = currentEdgeScrollType.element.scrollLeft + scrollValueAddOrMinus;
              currentEdgeScrollType.element.scrollTo({
                left: left > maxScrollLeft ? maxScrollLeft : left,
              });
            }
            break;
        }
      }
      if (typeof onScrolledRef.current === 'function') onScrolledRef.current();
    },
  });

  useEffect(() => {
    if (currentEdgeScrollType !== undefined) {
      prevEdgeScrollType.current = currentEdgeScrollType;
    }
  }, [currentEdgeScrollType]);

  return {
    disposeListEdgeScroll,
    disposeListEdgeScrollEnd,
  };
}
