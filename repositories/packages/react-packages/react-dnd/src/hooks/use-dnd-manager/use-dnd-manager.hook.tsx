'use client';

import { getTargetElementParentCycle, getTargetElementsParentCycle, unwrap } from '@wisdomstar94/vanilla-js-util';
import { IUseDndManager } from './use-dnd-manager.interface';
import { useAddEventListener } from '@wisdomstar94/react-add-event-listener';
import {
  transformingAndReturnDestinationInfo,
  generatePointerDownedInfo,
  getDndElementsFromPointerDownElement,
  getDragFinalInfo,
  isValidElementType,
} from './use-dnd-manager.macro';
import { CSSProperties, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import '@wisdomstar94/react-scroll-controller/style.css';
import { getTargetElementFromElementSelector, useScrollController } from '@wisdomstar94/react-scroll-controller';
import { useListEdgeScrollController } from './use-dnd-manager.macro.hook';

export function useDndManager<T extends string, K, E extends HTMLElement>(props: IUseDndManager.Props<T, K, E>) {
  const { dndGroupName, lists, getItemUniqueId, onDragEnd, animationDuration } = props;
  const pointerDownedInfo = useRef<IUseDndManager.PointerDownedInfo<T, E, K> | undefined>(undefined);
  const dragDestinationInfo = useRef<IUseDndManager.DragDestinationInfo<T, E> | undefined>(undefined);
  const isTransactioning = useRef(false);
  const isResolvingOrRejecting = useRef(false);
  const [isDnding, setIsDnding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollController = useScrollController();
  const isTouchDevice = useRef(false);
  const listEdgeScrollController = useListEdgeScrollController();

  // 드래그가 끝났을 때 애니메이션이 끝난 후에 갱신된 데이터를 렌더해야 하므로, 갱신되기 전 데이터를 저장하기 위해 필요.
  const listsSnapshot = useRef(lists);

  if (!isDnding) {
    listsSnapshot.current = lists;
  }

  function getList(id: T) {
    return unwrap(
      listsSnapshot.current.find((k) => k.id === id),
      `${id} id 에 해당하는 list 가 없습니다.`
    );
  }

  function handleWindowPointerDown(event: MouseEvent | TouchEvent) {
    if (isTransactioning.current) return;
    if (isDnding) return;

    const downTargetElement = event.target;
    if (!(downTargetElement instanceof Element)) {
      throw new Error(`pointer down 된 요소가 HTMLElement 인스턴스가 아닙니다.`);
    }

    const dndElements = getDndElementsFromPointerDownElement(downTargetElement, dndGroupName);
    if (dndElements === undefined) return;

    isTouchDevice.current = !(event instanceof MouseEvent);
    pointerDownedInfo.current = generatePointerDownedInfo(dndElements, event, lists, getItemUniqueId);

    scrollController.disableTextDrag({
      element: document.body,
    });
    scrollController.disableScroll({
      window: true,
    });

    // 드래그 목적지 정보 할당
    const pointerDownedInfoRef = pointerDownedInfo.current;
    if (pointerDownedInfoRef !== undefined) {
      scrollController.disableScroll({
        element: getTargetElementFromElementSelector(
          pointerDownedInfo.current?.pointerDownedList.scrollContainerElementSelector
        ),
      });
      dragDestinationInfo.current = transformingAndReturnDestinationInfo(event, pointerDownedInfoRef);
    }

    // setIsDnding(true);
    setTimeout(() => {
      setIsDnding(true);
    }, 50); // setTimeout 을 사용해서 아쉬운 부분 ㅠㅠ 다르게 할 방법이 없을까..?
  }

  function handleWindowPointerMove(event: MouseEvent | TouchEvent) {
    // 드래그가 완료된 후 이를 처리하는 중이면 막기
    if (isTransactioning.current) return;

    // 커서가 눌린 지점에 대한 정보가 없으면 막기
    const pointerDownedInfoRef = pointerDownedInfo.current;
    if (pointerDownedInfoRef === undefined) return;

    // 드래그 중이 아니면 막기
    if (!isDnding) return;

    // 커서가 드래그 중인 리스트의 가장자리 부분에 위치해 있는지 체크
    listEdgeScrollController.disposeListEdgeScroll(event, pointerDownedInfoRef, () => {
      dragDestinationInfo.current = transformingAndReturnDestinationInfo(event, pointerDownedInfoRef);
    });

    // 커서 위치에 따른 아이템 요소들 transform 적용 및 드래그 목적지 정보 할당
    dragDestinationInfo.current = transformingAndReturnDestinationInfo(event, pointerDownedInfoRef);
  }

  function handleWindowPointerUp(event: MouseEvent | TouchEvent) {
    if (isTransactioning.current) return;
    if (!isDnding) return;

    const pointerDownedInfoRef = pointerDownedInfo.current;
    if (pointerDownedInfoRef === undefined) return;

    isTransactioning.current = true;

    scrollController.enableTextDrag({
      element: document.body,
    });
    scrollController.enableScroll({
      window: true,
    });

    const dragDestinationInfoRef = dragDestinationInfo.current;
    if (isValidElementType(pointerDownedInfoRef.pointerDownedItemElement)) {
      pointerDownedInfoRef.pointerDownedItemElement.style.transition = `${animationDuration}ms transform`;
    }

    if (dragDestinationInfoRef === undefined) {
      onDragEnd(undefined);
      reject();
      return;
    }

    const finalDragInfo = getDragFinalInfo(pointerDownedInfoRef, dragDestinationInfoRef, getList);

    const drangEndInfo: IUseDndManager.DragEndInfo<T, K> = {
      fromListId: finalDragInfo.fromListId,
      fromItemIndex: finalDragInfo.fromItemIndex,
      fromWillChangeItems: finalDragInfo.fromItems,
      toListId: finalDragInfo.toListId,
      toItemIndex: finalDragInfo.toItemIndex,
      toWillChangeItems: finalDragInfo.toItems,
      resolve,
      reject,
      optimisticUpdate,
    };

    onDragEnd(drangEndInfo);
  }

  function resolve() {
    const pointerDownedInfoRef = pointerDownedInfo.current;
    if (pointerDownedInfoRef === undefined) return;

    const dragDestinationInfoRef = dragDestinationInfo.current;
    if (dragDestinationInfoRef === undefined) return;

    if (isValidElementType(pointerDownedInfoRef.pointerDownedItemElement)) {
      pointerDownedInfoRef.pointerDownedItemElement.style.transition = `${animationDuration}ms transform`;
    }

    const finalDragInfo = getDragFinalInfo(pointerDownedInfoRef, dragDestinationInfoRef, getList);

    finalDragInfo.toList.setItems(finalDragInfo.toItems);
    if (finalDragInfo.fromListId !== finalDragInfo.toListId) {
      finalDragInfo.fromList.setItems(finalDragInfo.fromItems);
    }

    isTransactioning.current = true;
    isResolvingOrRejecting.current = true;
    const translateX = `${dragDestinationInfoRef.destinationItemRect.x - pointerDownedInfoRef.pointerDownedItemRectSnapshot.x}px`;
    const translateY = `${dragDestinationInfoRef.destinationItemRect.y - pointerDownedInfoRef.pointerDownedItemRectSnapshot.y}px`;
    if (isValidElementType(pointerDownedInfoRef.pointerDownedItemElement)) {
      pointerDownedInfoRef.pointerDownedItemElement.style.transform = `translate(${translateX}, ${translateY})`;
    }

    if (animationDuration === 0) {
      restore();
    } else {
      setTimeout(() => {
        restore();
      }, animationDuration);
    }
  }

  function reject() {
    const pointerDownedInfoRef = pointerDownedInfo.current;
    if (pointerDownedInfoRef === undefined) {
      return;
    }

    isTransactioning.current = true;
    isResolvingOrRejecting.current = true;
    if (isValidElementType(pointerDownedInfoRef.pointerDownedItemElement)) {
      pointerDownedInfoRef.pointerDownedItemElement.style.transition = `${animationDuration}ms transform`;
    }
    pointerDownedInfoRef.lists.forEach((list) => {
      list.items.forEach((item) => {
        if (isValidElementType(item.itemElement)) {
          item.itemElement.style.transform = 'translate(0px, 0px)';
        }
      });
    });

    if (animationDuration === 0) {
      restore();
    } else {
      setTimeout(() => {
        restore();
      }, animationDuration);
    }
  }

  function optimisticUpdate() {
    const dragDestinationInfoRef = dragDestinationInfo.current;
    if (dragDestinationInfoRef === undefined) return;

    const pointerDownedInfoRef = pointerDownedInfo.current;
    if (pointerDownedInfoRef === undefined) return;

    isTransactioning.current = true;
    const translateX = `${dragDestinationInfoRef.destinationItemRect.x - pointerDownedInfoRef.pointerDownedItemRectSnapshot.x}px`;
    const translateY = `${dragDestinationInfoRef.destinationItemRect.y - pointerDownedInfoRef.pointerDownedItemRectSnapshot.y}px`;
    if (isValidElementType(pointerDownedInfoRef.pointerDownedItemElement)) {
      pointerDownedInfoRef.pointerDownedItemElement.style.transform = `translate(${translateX}, ${translateY})`;
    }
  }

  function restore() {
    listsSnapshot.current = lists;

    pointerDownedInfo.current?.lists.forEach((list) => {
      if (isTouchDevice.current) {
        const targetElement = getTargetElementFromElementSelector(list.scrollContainerElementSelector);
        if (targetElement !== null) {
          scrollController.enableScroll({
            element: targetElement,
          });
          scrollController.enableTextDrag({
            element: targetElement,
          });
        }
      }
    });

    isTransactioning.current = false;
    isResolvingOrRejecting.current = false;
    pointerDownedInfo.current = undefined;
    dragDestinationInfo.current = undefined;
    setIsDnding(false);
  }

  function getItems(id: T) {
    const targetList = getList(id);
    return targetList.items;
  }

  function isDraggingItem(item: K) {
    if (!isDnding) return false;
    return pointerDownedInfo.current?.pointerDownedItemId === getItemUniqueId(item);
  }

  function renderList(
    id: T,
    fn: (
      listProps: IUseDndManager.RequiredListProps<T>,
      listStyle: CSSProperties,
      listItems: IUseDndManager.RenderItem<K>[]
    ) => ReactNode
  ) {
    const list = getList(id);

    const requiredListProps: IUseDndManager.RequiredListProps<T> = {
      'data-w-react-dnd-group-name': dndGroupName,
      'data-w-react-dnd-list-id': id,
      'data-w-react-dnd-list': 'true',
      'data-w-react-dnd-list-type': list.listType.type,
    };

    const style: CSSProperties = {
      width: list.listType.type === 'one-row' ? 'max-content' : undefined,
      display: list.listType.type === 'grid' ? 'grid' : 'flex',
      gridTemplateColumns:
        list.listType.type === 'grid' ? `repeat(${list.listType.colCount}, minmax(0, 1fr))` : undefined,
      flexDirection: (function () {
        if (list.listType.type === 'one-col') return 'column';
        if (list.listType.type === 'one-row') return 'row';
        return undefined;
      })(),
    };

    const convertedItems: Array<IUseDndManager.RenderItem<K>> = list.items.map((item, index) => {
      const itemProps: IUseDndManager.RequiredItemProps = {
        'data-w-react-dnd-group-name': dndGroupName,
        'data-w-react-dnd-list-item-id': getItemUniqueId(item),
        'data-w-react-dnd-list-item-index': index.toString(),
        'data-w-react-dnd-list-item': 'true',
      };

      const itemStyle: CSSProperties = {
        flexShrink: list.listType.type === 'one-row' ? '0' : undefined,
      };

      return {
        item,
        itemProps,
        itemStyle,
        itemHandlerProps: {
          'data-w-react-dnd-list-item-handler': 'true',
          'data-w-react-dnd-group-name': dndGroupName,
        },
      };
    });

    return fn(requiredListProps, style, convertedItems);
  }

  // handleWindowPointerDown
  useAddEventListener({
    windowEventRequiredInfo: { eventName: 'mousedown', eventListener: (event) => handleWindowPointerDown(event) },
  });
  useAddEventListener({
    windowEventRequiredInfo: { eventName: 'touchstart', eventListener: (event) => handleWindowPointerDown(event) },
  });

  // handleWindowPointerMove
  useAddEventListener({
    windowEventRequiredInfo: { eventName: 'mousemove', eventListener: (event) => handleWindowPointerMove(event) },
  });
  useAddEventListener({
    windowEventRequiredInfo: { eventName: 'touchmove', eventListener: (event) => handleWindowPointerMove(event) },
  });

  // handleWindowPointerUp
  useAddEventListener({
    windowEventRequiredInfo: { eventName: 'mouseup', eventListener: (event) => handleWindowPointerUp(event) },
  });
  useAddEventListener({
    windowEventRequiredInfo: { eventName: 'touchend', eventListener: (event) => handleWindowPointerUp(event) },
  });

  // drag cancel handler
  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'keydown',
      eventListener(event) {
        const key = event.key;
        if (isResolvingOrRejecting.current) {
          return;
        }

        if (key.toLowerCase() === 'escape') {
          reject();
        }
      },
    },
  });

  useLayoutEffect(() => {
    if (!isDnding) {
      listsSnapshot.current = lists;

      const pointerDownedInfoRef = pointerDownedInfo.current;
      if (pointerDownedInfoRef !== undefined) {
        pointerDownedInfoRef.lists.forEach((list) => {
          if (isValidElementType(list.dndListElement)) {
            list.dndListElement.style.zIndex = '1';
          }

          list.items.forEach((item) => {
            if (isValidElementType(item.itemElement)) {
              item.itemElement.style.zIndex = '1';
            }
          });
        });

        const parentListItemElements = getTargetElementsParentCycle(
          pointerDownedInfoRef.pointerDownedListElement,
          (currentElement) => {
            return currentElement.getAttribute('data-w-react-dnd-list-item') === 'true';
          }
        );
        parentListItemElements.forEach((element) => {
          if (isValidElementType(element)) {
            element.style.zIndex = '1';
          }
        });
      }

      scrollController.enableScroll({
        element: getTargetElementFromElementSelector(
          pointerDownedInfo.current?.pointerDownedList.scrollContainerElementSelector
        ),
      });

      listEdgeScrollController.disposeListEdgeScrollEnd();
      pointerDownedInfo.current = undefined;
      isTransactioning.current = false;
    }
  }, [isDnding]);

  useEffect(() => {
    let condition = true;
    if (isTouchDevice.current) {
      condition = scrollController.isWindowScrollPrevent;
    }

    if (isDnding && condition) {
      const parentListItemElement = getTargetElementParentCycle(
        pointerDownedInfo.current?.pointerDownedListElement,
        (currentElement) => {
          return currentElement.getAttribute('data-w-react-dnd-list-item') === 'true';
        }
      );
      if (isValidElementType(parentListItemElement)) {
        Array.from(parentListItemElement.parentElement?.children ?? []).forEach((element) => {
          if (isValidElementType(element)) {
            element.style.zIndex = parentListItemElement === element ? '3' : '2';
          }
        });
      }

      // item 에 transition 속성 추가
      pointerDownedInfo.current?.lists.forEach((list) => {
        if (isValidElementType(list.dndListElement)) {
          list.dndListElement.style.zIndex = list.id === pointerDownedInfo.current?.pointerDownedListId ? '2' : '1';
        }

        if (isTouchDevice.current && list.scrollContainerElementSelector !== undefined) {
          const targetElement = getTargetElementFromElementSelector(list.scrollContainerElementSelector);
          if (targetElement !== null) {
            scrollController.disableScroll({
              element: targetElement,
            });
            scrollController.disableTextDrag({
              element: targetElement,
            });
          }
        }

        list.items.forEach((item, index) => {
          if (!isValidElementType(item.itemElement)) return;

          if (item.itemUniqueId === pointerDownedInfo.current?.pointerDownedItemId) {
            item.itemElement.style.transition = 'none';
            item.itemElement.style.zIndex = '2';
            return;
          }

          const transition = `${animationDuration}ms transform`;
          if (item.itemElement.style.transition !== transition) {
            item.itemElement.style.transition = transition;
          }
          item.itemElement.style.zIndex = '1';
        });
      });
    }
  }, [isDnding, scrollController.isWindowScrollPrevent]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    mounted,
    lists,
    isDnding,
    renderList,
    getItems,
    isDraggingItem,
    resolve,
    reject,
    optimisticUpdate,
  };
}
