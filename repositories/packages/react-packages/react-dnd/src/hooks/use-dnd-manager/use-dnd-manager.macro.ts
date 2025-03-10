import {
  getPointerDownedCoordinate,
  getTargetElementParentCycle,
  isContainCoordinate,
  IsContainCoordinateTargetArea,
  unwrap,
} from '@wisdomstar94/vanilla-js-util';
import { IUseDndManager } from './use-dnd-manager.interface';
import { getTargetElementFromElementSelector } from '@wisdomstar94/react-scroll-controller';

export function getDndElementsFromPointerDownElement(downTargetElement: HTMLElement, dndGroupName: string) {
  // 핸들러 요소를 클릭했는지 체크
  const dndHandlerElement = getTargetElementParentCycle(
    downTargetElement,
    (currentElement) => {
      const value = currentElement.getAttribute('data-w-react-dnd-list-item-handler');
      const dataDndGroupName = currentElement.getAttribute('data-w-react-dnd-group-name');
      return value === 'true' && dataDndGroupName === dndGroupName;
    },
    5
  );

  if (dndHandlerElement === null) return;

  // 해당 핸들러 요소가 속한 item 요소를 체크
  const dndItemElement = getTargetElementParentCycle(
    dndHandlerElement,
    (currentElement) => {
      const value = currentElement.getAttribute('data-w-react-dnd-list-item');
      return value === 'true';
    },
    10
  );

  if (dndItemElement === null) return;

  // 해당 핸들러 요소가 속한 list 요소를 체크
  const dndListElement = getTargetElementParentCycle(
    dndItemElement,
    (currentElement) => {
      const value = currentElement.getAttribute('data-w-react-dnd-list');
      return value === 'true';
    },
    5
  );

  if (dndListElement === null) return;

  return {
    dndHandlerElement,
    dndItemElement,
    dndListElement,
  };
}

export function getListInfoFromPointerDownDndElements<T extends string>(
  dndElements: NonNullable<ReturnType<typeof getDndElementsFromPointerDownElement>>
) {
  const { dndItemElement, dndListElement } = dndElements;

  const listId = dndListElement.getAttribute('data-w-react-dnd-list-id'); // ex) backlog | processing | done ... 등
  const itemId = dndItemElement.getAttribute('data-w-react-dnd-list-item-id');
  const itemIndex = Number(dndItemElement.getAttribute('data-w-react-dnd-list-item-index'));

  if (typeof listId !== 'string' || typeof itemId !== 'string') {
    return undefined;
  }

  return {
    listId: listId as T,
    itemId,
    itemIndex,
  };
}

export function generatePointerDownedInfo<T extends string, K, E extends HTMLElement>(
  dndElements: NonNullable<ReturnType<typeof getDndElementsFromPointerDownElement>>,
  event: TouchEvent | MouseEvent,
  lists: Array<IUseDndManager.ListInfo<T, K, E>>,
  itemUniqueId: (item: K) => string
) {
  const { dndHandlerElement, dndItemElement, dndListElement } = dndElements;

  const listInfo = getListInfoFromPointerDownDndElements<T>(dndElements);
  if (listInfo === undefined) return undefined;

  const list = lists.find((k) => k.id === listInfo.listId);
  if (list === undefined) return undefined;

  const [pointerDownedCoordinateX, pointerDownedCoordinateY] = getPointerDownedCoordinate(event);
  const rect = dndItemElement.getBoundingClientRect();

  const result: IUseDndManager.PointerDownedInfo<T, E, K> = {
    pointerDownedList: list,
    pointerDownedListId: listInfo.listId,
    pointerDownedListElement: dndListElement,
    pointerDownedItemId: listInfo.itemId,
    pointerDownedItemIndex: listInfo.itemIndex,
    pointerDownedItemElement: dndItemElement,
    pointerDownedCoordinate: {
      x: pointerDownedCoordinateX,
      y: pointerDownedCoordinateY,
    },
    pointerDownedItemRectSnapshot: rect,
    lists: lists
      .filter((list) => document.querySelector<HTMLElement>(`[data-w-react-dnd-list-id='${list.id}']`) !== null)
      .map((list) => {
        const dndListElement = unwrap(
          document.querySelector<HTMLElement>(`[data-w-react-dnd-list-id='${list.id}']`),
          `list id 가 ${list.id} 인 요소가 없습니다.`
        );
        const dndListElementRect = dndListElement.getBoundingClientRect();

        const tl: IUseDndManager.Coordinate = { x: dndListElementRect.x, y: dndListElementRect.y };
        const tr: IUseDndManager.Coordinate = {
          x: dndListElementRect.x + dndListElementRect.width,
          y: dndListElementRect.y,
        };
        const bl: IUseDndManager.Coordinate = {
          x: dndListElementRect.x,
          y: dndListElementRect.y + dndListElementRect.height,
        };
        const br: IUseDndManager.Coordinate = {
          x: dndListElementRect.x + dndListElementRect.width,
          y: dndListElementRect.y + dndListElementRect.height,
        };

        const scrollContainerElement = getTargetElementFromElementSelector(list.scrollContainerElementSelector);

        const result: IUseDndManager.PointerDownInfoListInfo<T, E> = {
          id: list.id,
          dndListElement,
          snapshotRectInfo: {
            x: dndListElementRect.x,
            y: dndListElementRect.y,
            width: dndListElementRect.width,
            height: dndListElementRect.height,
            tl,
            tr,
            bl,
            br,
          },
          listType: list.listType,
          scrollContainerElementSelector: list.scrollContainerElementSelector,
          scrollContainerElementSnapshotRect: scrollContainerElement?.getBoundingClientRect(),
          items: list.items.map((item) => {
            const itemElement = unwrap(
              dndListElement.querySelector<HTMLElement>(`[data-w-react-dnd-list-item-id='${itemUniqueId(item)}']`),
              `${itemUniqueId(item)} 에 해당하는 아이템 요소가 없습니다.`
            );
            const itemElementRect = itemElement.getBoundingClientRect();

            const tl: IUseDndManager.Coordinate = { x: itemElementRect.x, y: itemElementRect.y };
            const tr: IUseDndManager.Coordinate = {
              x: itemElementRect.x + itemElementRect.width,
              y: itemElementRect.y,
            };
            const bl: IUseDndManager.Coordinate = {
              x: itemElementRect.x,
              y: itemElementRect.y + itemElementRect.height,
            };
            const br: IUseDndManager.Coordinate = {
              x: itemElementRect.x + itemElementRect.width,
              y: itemElementRect.y + itemElementRect.height,
            };

            const result: IUseDndManager.PointerDownInfoListInfoItem = {
              itemUniqueId: itemUniqueId(item),
              itemElement,
              snapshotRectInfo: {
                x: itemElementRect.x,
                y: itemElementRect.y,
                width: itemElementRect.width,
                height: itemElementRect.height,
                tl,
                tr,
                bl,
                br,
              },
            };
            return result;
          }),
        };

        return result;
      }),
  };
  return result;
}

export function getCursoredTargetList<T extends string, E extends HTMLElement, K>(
  pointerDownedInfoRef: IUseDndManager.PointerDownedInfo<T, E, K>,
  coordinate: [number, number]
) {
  return pointerDownedInfoRef.lists.find((list) => {
    const currentListRect = list.dndListElement.getBoundingClientRect();
    const isContain = isContainCoordinate(coordinate, {
      x: currentListRect.x,
      y: currentListRect.y,
      width: currentListRect.width,
      height: currentListRect.height,
    });
    return isContain;
  });
}

export function transformingListItemsButExcludeTargetList<T extends string, E extends HTMLElement, K>(
  pointerDownedInfoRef: IUseDndManager.PointerDownedInfo<T, E, K>,
  cursoredTargetList: IUseDndManager.PointerDownInfoListInfo<T, E> | undefined
) {
  for (const list of pointerDownedInfoRef.lists) {
    if (cursoredTargetList?.id === list.id) continue;

    list.items.forEach((item, index) => {
      if (item.itemUniqueId === pointerDownedInfoRef.pointerDownedItemId) {
        return;
      }

      let translateX = '0px';
      let translateY = '0px';
      let transform = `translate(${translateX}, ${translateY})`;
      if (pointerDownedInfoRef.pointerDownedListId === list.id && index > pointerDownedInfoRef.pointerDownedItemIndex) {
        switch (list.listType.type) {
          case 'one-col':
            translateX = `0px`;
            translateY = `-${pointerDownedInfoRef.pointerDownedItemElement.clientHeight}px`;
            transform = `translate(${translateX}, ${translateY})`;
            break;
          case 'one-row':
            translateX = `-${pointerDownedInfoRef.pointerDownedItemElement.clientWidth}px`;
            translateY = `0px`;
            transform = `translate(${translateX}, ${translateY})`;
            break;
          case 'grid':
            const virtualIndex = index - 1;
            const realColIndex = index % list.listType.colCount;
            const realRowIndex = Math.floor(index / list.listType.colCount);
            const virtualColIndex = virtualIndex % list.listType.colCount;
            const virtualRowIndex = Math.floor(virtualIndex / list.listType.colCount);

            translateY = `${pointerDownedInfoRef.pointerDownedItemElement.clientHeight * (virtualRowIndex - realRowIndex)}px`;
            translateX = `${pointerDownedInfoRef.pointerDownedItemElement.clientWidth * (virtualColIndex - realColIndex)}px`;
            transform = `translate(${translateX}, ${translateY})`;
            break;
        }
      }

      if (transform !== item.itemElement.style.transform) {
        item.itemElement.style.transform = transform;
      }
    });
  }
}

export function transformingCursoredTargetListItems<T extends string, E extends HTMLElement, K>(
  cursorPositionedInfo: IUseDndManager.CursorPositionedInfo,
  cursoredTargetListItems: IUseDndManager.PointerDownInfoListInfoItem[],
  cursoredTargetList: IUseDndManager.PointerDownInfoListInfo<T, E>,
  isSelf: boolean,
  pointerDownedInfoRef: IUseDndManager.PointerDownedInfo<T, E, K>
) {
  cursoredTargetListItems.forEach((item, index) => {
    if (isSelf) {
      if (index >= pointerDownedInfoRef.pointerDownedItemIndex) {
        // 0 >= 0
        let translateX = `0px`;
        let translateY = `0px`;
        let transform = `translate(${translateX}, ${translateY})`;
        if (index < cursorPositionedInfo.index) {
          // 1
          switch (cursoredTargetList.listType.type) {
            case 'one-col':
              translateX = `0px`;
              translateY = `-${pointerDownedInfoRef.pointerDownedItemElement.clientHeight}px`;
              transform = `translate(${translateX}, ${translateY})`;
              break;
            case 'one-row':
              translateX = `-${pointerDownedInfoRef.pointerDownedItemElement.clientWidth}px`;
              translateY = `0px`;
              transform = `translate(${translateX}, ${translateY})`;
              break;
            case 'grid':
              const virtualIndex = index; // -1
              const realColIndex = (index + 1) % cursoredTargetList.listType.colCount;
              const realRowIndex = Math.floor((index + 1) / cursoredTargetList.listType.colCount);
              const virtualColIndex = virtualIndex % cursoredTargetList.listType.colCount;
              const virtualRowIndex = Math.floor(virtualIndex / cursoredTargetList.listType.colCount);

              translateY = `${pointerDownedInfoRef.pointerDownedItemElement.clientHeight * (virtualRowIndex - realRowIndex)}px`;
              translateX = `${pointerDownedInfoRef.pointerDownedItemElement.clientWidth * (virtualColIndex - realColIndex)}px`;
              transform = `translate(${translateX}, ${translateY})`;
              item.itemElement.setAttribute('data-where', '111');
              break;
          }
        }

        if (transform !== item.itemElement.style.transform) {
          item.itemElement.style.transform = transform;
        }
      } else {
        let translateX = `0px`;
        let translateY = `0px`;
        let transform = `translate(${translateX}, ${translateY})`;
        if (index >= cursorPositionedInfo.index) {
          switch (cursoredTargetList.listType.type) {
            case 'one-col':
              translateX = `0px`;
              translateY = `${pointerDownedInfoRef.pointerDownedItemElement.clientHeight}px`;
              transform = `translate(${translateX}, ${translateY})`;
              break;
            case 'one-row':
              translateX = `${pointerDownedInfoRef.pointerDownedItemElement.clientWidth}px`;
              translateY = `0px`;
              transform = `translate(${translateX}, ${translateY})`;
              break;
            case 'grid':
              const virtualIndex = index + 1;
              const realColIndex = index % cursoredTargetList.listType.colCount;
              const realRowIndex = Math.floor(index / cursoredTargetList.listType.colCount);
              const virtualColIndex = virtualIndex % cursoredTargetList.listType.colCount;
              const virtualRowIndex = Math.floor(virtualIndex / cursoredTargetList.listType.colCount);

              translateY = `${pointerDownedInfoRef.pointerDownedItemElement.clientHeight * (virtualRowIndex - realRowIndex)}px`;
              translateX = `${pointerDownedInfoRef.pointerDownedItemElement.clientWidth * (virtualColIndex - realColIndex)}px`;
              transform = `translate(${translateX}, ${translateY})`;
              item.itemElement.setAttribute('data-where', '222');
              break;
          }
        }

        if (transform !== item.itemElement.style.transform) {
          item.itemElement.style.transform = transform;
        }
      }
      return;
    }

    let translateX = `0px`;
    let translateY = `0px`;
    let transform = `translate(${translateX}, ${translateY})`;
    if (index >= cursorPositionedInfo.index) {
      switch (cursoredTargetList.listType.type) {
        case 'one-col':
          translateX = `0px`;
          translateY = `${pointerDownedInfoRef.pointerDownedItemElement.clientHeight}px`;
          transform = `translate(${translateX}, ${translateY})`;
          break;
        case 'one-row':
          translateX = `${pointerDownedInfoRef.pointerDownedItemElement.clientWidth}px`;
          translateY = `0px`;
          transform = `translate(${translateX}, ${translateY})`;
          break;
        case 'grid':
          const virtualIndex = index + 1;
          const realColIndex = index % cursoredTargetList.listType.colCount;
          const realRowIndex = Math.floor(index / cursoredTargetList.listType.colCount);
          const virtualColIndex = virtualIndex % cursoredTargetList.listType.colCount;
          const virtualRowIndex = Math.floor(virtualIndex / cursoredTargetList.listType.colCount);

          translateY = `${pointerDownedInfoRef.pointerDownedItemElement.clientHeight * (virtualRowIndex - realRowIndex)}px`;
          translateX = `${pointerDownedInfoRef.pointerDownedItemElement.clientWidth * (virtualColIndex - realColIndex)}px`;
          transform = `translate(${translateX}, ${translateY})`;
          break;
      }
    }

    if (transform !== item.itemElement.style.transform) {
      item.itemElement.style.transform = transform;
    }
  });
}

export function getCursoredTargetListItems<T extends string, E extends HTMLElement, K>(
  isSelf: boolean,
  cursoredTargetList: IUseDndManager.PointerDownInfoListInfo<T, E>,
  pointerDownedInfoRef: IUseDndManager.PointerDownedInfo<T, E, K>
) {
  if (isSelf) {
    return cursoredTargetList.items.filter((_, index) => {
      const isInclude = index !== pointerDownedInfoRef.pointerDownedItemIndex;
      return isInclude;
    });
  }
  return cursoredTargetList.items;
}

export function getCursorPositionedInfo<T extends string, E extends HTMLElement, K>(
  cursoredTargetList: IUseDndManager.PointerDownInfoListInfo<T, E>,
  pointerDownedInfoRef: IUseDndManager.PointerDownedInfo<T, E, K>,
  isSelf: boolean,
  cursor: IUseDndManager.Coordinate,
  scroll: IUseDndManager.Coordinate
): IUseDndManager.CursorPositionedInfo | undefined {
  let info: IUseDndManager.CursorPositionedInfo | undefined = undefined;

  if (cursoredTargetList.items.length === 0) {
    const area: IsContainCoordinateTargetArea = {
      x: cursoredTargetList.snapshotRectInfo.x,
      y: cursoredTargetList.snapshotRectInfo.y,
      width: pointerDownedInfoRef.pointerDownedItemRectSnapshot.width,
      height: pointerDownedInfoRef.pointerDownedItemRectSnapshot.height,
    };
    info = {
      index: 0,
      itemArea: area,
    };
    return info;
  }

  let appendRectClientX = 0;
  let appendRectClientY = 0;

  // findIndex start
  let foreachIndex = 0;
  for (const item of cursoredTargetList.items) {
    const calculate = () => {
      const nextItem = cursoredTargetList.items[isSelf ? foreachIndex + 1 : foreachIndex];
      const nextItemWidth =
        nextItem?.itemElement.clientWidth ?? pointerDownedInfoRef.pointerDownedItemElement.clientWidth;
      const nextItemHeight =
        nextItem?.itemElement.clientHeight ?? pointerDownedInfoRef.pointerDownedItemElement.clientHeight;

      if (appendRectClientX === 0) {
        appendRectClientX = item.snapshotRectInfo.x;
      }

      if (appendRectClientY === 0) {
        appendRectClientY = item.snapshotRectInfo.y;
      }

      const area: IsContainCoordinateTargetArea = {
        x: appendRectClientX,
        y: appendRectClientY,
        width: nextItemWidth,
        height: nextItemHeight,
      };

      switch (cursoredTargetList.listType.type) {
        case 'one-col':
          appendRectClientY += nextItemHeight;
          break;
        case 'one-row':
          appendRectClientX += nextItemWidth;
          break;
        case 'grid':
          area.x = item.snapshotRectInfo.x;
          area.y = item.snapshotRectInfo.y;
          break;
      }

      const result = isContainCoordinate([cursor.x + scroll.x, cursor.y + scroll.y], area);
      return { result, area };
    };

    if (!isSelf) {
      const { result, area } = calculate();
      if (result) {
        info = {
          index: foreachIndex,
          itemArea: area,
        };
        break;
      }
      foreachIndex++;
      continue;
    }

    if (foreachIndex >= pointerDownedInfoRef.pointerDownedItemIndex) {
      const { result, area } = calculate();
      if (result) {
        info = {
          index: foreachIndex,
          itemArea: area,
        };
        break;
      }
      foreachIndex++;
      continue;
    }

    const area: IsContainCoordinateTargetArea = {
      x: item.snapshotRectInfo.x,
      y: item.snapshotRectInfo.y,
      width: item.snapshotRectInfo.width,
      height: item.snapshotRectInfo.height,
    };
    const result = isContainCoordinate([cursor.x + scroll.x, cursor.y + scroll.y], area);
    if (result) {
      info = {
        index: foreachIndex,
        itemArea: area,
      };
      break;
    }

    foreachIndex++;
  }

  if (info === undefined) {
    info = (function () {
      if (cursoredTargetList.listType.type === 'grid') {
        const lastItem = cursoredTargetList.items[cursoredTargetList.items.length - 1];
        const lastItemIndex = cursoredTargetList.items.length - 1;

        const virtualIndex = lastItemIndex + 1;
        const realColIndex = lastItemIndex % cursoredTargetList.listType.colCount;
        const realRowIndex = Math.floor(lastItemIndex / cursoredTargetList.listType.colCount);
        const virtualColIndex = virtualIndex % cursoredTargetList.listType.colCount;
        const virtualRowIndex = Math.floor(virtualIndex / cursoredTargetList.listType.colCount);

        const appendX = virtualColIndex - realColIndex;
        const appendY = virtualRowIndex - realRowIndex;

        const area: IsContainCoordinateTargetArea = {
          x: lastItem.snapshotRectInfo.x + pointerDownedInfoRef.pointerDownedItemElement.clientWidth * appendX,
          y: lastItem.snapshotRectInfo.y + pointerDownedInfoRef.pointerDownedItemElement.clientHeight * appendY,
          width: pointerDownedInfoRef.pointerDownedItemElement.clientWidth,
          height: pointerDownedInfoRef.pointerDownedItemElement.clientHeight,
        };

        const isInclude = isContainCoordinate([cursor.x + scroll.x, cursor.y + scroll.y], area);
        if (isInclude) {
          const info: IUseDndManager.CursorPositionedInfo = {
            index: isSelf ? cursoredTargetList.items.length - 1 : cursoredTargetList.items.length,
            itemArea: area,
          };
          return info;
        }
      }

      if (!isSelf) {
        const area: IsContainCoordinateTargetArea = {
          x: appendRectClientX,
          y: appendRectClientY,
          width: pointerDownedInfoRef.pointerDownedItemElement.clientWidth,
          height: pointerDownedInfoRef.pointerDownedItemElement.clientHeight,
        };

        const isInclude = isContainCoordinate([cursor.x + scroll.x, cursor.y + scroll.y], area);
        if (isInclude) {
          const info: IUseDndManager.CursorPositionedInfo = {
            index: cursoredTargetList.items.length,
            itemArea: area,
          };
          return info;
        }
      }
    })();
  }

  return info;
}

export function getScrolledInfo<T extends string, E extends HTMLElement, K>(
  pointerDownedInfoRef: IUseDndManager.PointerDownedInfo<T, E, K>
) {
  // const anythingPickList = pointerDownedInfoRef.lists[0];
  const scrollContainerExistList = pointerDownedInfoRef.lists.find((list) => {
    const element = getTargetElementFromElementSelector(list.scrollContainerElementSelector);
    return element;
  });

  let scrollX = 0;
  let scrollY = 0;

  // if (scrollContainerExistList !== undefined) {
  //   const element = getTargetElementFromElementSelector(scrollContainerExistList.scrollContainerElementSelector);
  //   const curentRect = element?.getBoundingClientRect();
  //   const snapshotRect = scrollContainerExistList.scrollContainerElementSnapshotRect;
  //   scrollX = (snapshotRect?.x ?? 0) - (curentRect?.x ?? 0);
  //   scrollY = (snapshotRect?.y ?? 0) - (curentRect?.y ?? 0);
  // } else {
  //   const list = pointerDownedInfoRef.lists[0];
  //   const element = list.dndListElement;
  //   const curentRect = element?.getBoundingClientRect();
  //   const snapshotRect = list.snapshotRectInfo;
  //   scrollX = (snapshotRect?.x ?? 0) - (curentRect?.x ?? 0);
  //   scrollY = (snapshotRect?.y ?? 0) - (curentRect?.y ?? 0);
  // }
  const list = pointerDownedInfoRef.lists[0];
  const element = list.dndListElement;
  const curentRect = element?.getBoundingClientRect();
  const snapshotRect = list.snapshotRectInfo;
  scrollX = (snapshotRect?.x ?? 0) - (curentRect?.x ?? 0);
  scrollY = (snapshotRect?.y ?? 0) - (curentRect?.y ?? 0);

  return { scrollX, scrollY };
}

export function transformingAndReturnDestinationInfo<T extends string, E extends HTMLElement, K>(
  event: MouseEvent | TouchEvent,
  pointerDownedInfoRef: IUseDndManager.PointerDownedInfo<T, E, K>
): IUseDndManager.DragDestinationInfo<T, E> | undefined {
  // 드래그를 위해 커서가 눌린 지점에 대한 좌표 정보 가져오기
  const [cursorX, cursorY] = getPointerDownedCoordinate(event);

  // 드래그가 시작 되었을 때의 리스트의 위치값과 현재 위치값의 차이를 이용해 스크롤된 양을 계산하기
  const { scrollX, scrollY } = getScrolledInfo(pointerDownedInfoRef);

  // 현재 커서 위치에 맞춰 드래그 되고 있는 아이템의 위치 조정
  const translateX = `translateX(${cursorX - pointerDownedInfoRef.pointerDownedCoordinate.x + scrollX}px)`;
  const translateY = `translateY(${cursorY - pointerDownedInfoRef.pointerDownedCoordinate.y + scrollY}px)`;
  pointerDownedInfoRef.pointerDownedItemElement.style.transform = `${translateX} ${translateY}`;

  // 드래그중에 현재 초점이 가있는 리스트 찾기
  const cursoredTargetList = getCursoredTargetList(pointerDownedInfoRef, [cursorX, cursorY]);

  // 리스트별로 아이템들의 위치 초기화 (단, 현재 커서가 위치한 영역의 리스트들의 아이템들은 제외)
  transformingListItemsButExcludeTargetList(pointerDownedInfoRef, cursoredTargetList);

  // 커서가 위치해 있는 리스트가 없다면 여기서 함수 종료
  if (cursoredTargetList === undefined) {
    // disposeListEdgeScrollEnd();
    return undefined;
  }

  // 현재 드래그 되고 있는 리스트 영역이 드래그 타겟 아이템이 속한 리스트 인지에 대한 여부
  const isSelf = pointerDownedInfoRef.pointerDownedListId === cursoredTargetList.id;

  // 현재 커서가 위치한 리스트 영역에 대한 아이템 목록 가져오기 (isSelf 에 따라 가져오는 로직이 다름)
  const cursoredTargetListItems = getCursoredTargetListItems(isSelf, cursoredTargetList, pointerDownedInfoRef);

  // 현재 드래그 되고 있는 리스트에 커서가 위치하고 있는 영역에 대한 정보
  const cursorPositionedInfo = getCursorPositionedInfo(
    cursoredTargetList,
    pointerDownedInfoRef,
    isSelf,
    { x: cursorX, y: cursorY },
    { x: scrollX, y: scrollY }
  );

  if (cursorPositionedInfo !== undefined) {
    // 드래그 되고 있는 리스트에 대한 아이템들의 위치 조정
    transformingCursoredTargetListItems(
      cursorPositionedInfo,
      cursoredTargetListItems,
      cursoredTargetList,
      isSelf,
      pointerDownedInfoRef
    );
    return {
      destinationList: cursoredTargetList,
      destinationItemIndex: cursorPositionedInfo.index,
      destinationItemRect: cursorPositionedInfo.itemArea,
    };
  } else {
    return undefined;
  }
}
