import { IUseScrollController } from '@wisdomstar94/react-scroll-controller';
import { IsContainCoordinateTargetArea } from '@wisdomstar94/vanilla-js-util';
import { CSSProperties, Dispatch, SetStateAction } from 'react';

export declare namespace IUseDndManager {
  export type Direction = 'top' | 'bottom' | 'left' | 'right';

  export type EdgeScrollTypeElement = {
    type: 'element';
    direction: Direction;
    element: HTMLElement;
  };

  export type EdgeScrollTypeWindow = {
    type: 'window';
    direction: Direction;
  };

  export type EdgeScrollType = EdgeScrollTypeElement | EdgeScrollTypeWindow;

  export type RequiredItemStateStructure = {
    id: string;
  };

  export type ListInfo<T extends string, K extends RequiredItemStateStructure, E extends HTMLElement> = {
    id: T;
    items: Array<K>;
    setItems: Dispatch<SetStateAction<Array<K>>>;
    listType: ListType;
    scrollContainerElementSelector?: IUseScrollController.ElementSelector<E> | null;
    // targetScrollContainerSelector?: string;
  };

  export type Coordinate = {
    x: number;
    y: number;
  };

  export type RectInfo = {
    x: number;
    y: number;
    width: number;
    height: number;
    tl: Coordinate;
    tr: Coordinate;
    bl: Coordinate;
    br: Coordinate;
  };

  export type PointerDownInfoListInfoItem = {
    id: string;
    itemElement: HTMLElement;
    snapshotRectInfo: RectInfo;
  };

  export type PointerDownInfoListInfo<T extends string, E extends HTMLElement> = {
    id: T;
    dndListElement: HTMLElement;
    snapshotRectInfo: RectInfo;
    // targetScrollContainerScrollState?: Coordinate;
    items: Array<PointerDownInfoListInfoItem>;
    listType: ListType;
    scrollContainerElementSelector?: IUseScrollController.ElementSelector<E> | null;
    scrollContainerElementSnapshotRect?: DOMRect;
  };

  export type PointerDownedInfo<T extends string, E extends HTMLElement, K extends RequiredItemStateStructure> = {
    pointerDownedList: IUseDndManager.ListInfo<T, K, E>;
    pointerDownedCoordinate: Coordinate;
    pointerDownedListId: T;
    pointerDownedListElement: HTMLElement;
    pointerDownedItemId: string;
    pointerDownedItemIndex: number;
    pointerDownedItemElement: HTMLElement;
    pointerDownedItemRectSnapshot: DOMRect;
    lists: Array<PointerDownInfoListInfo<T, E>>;
  };

  export type RequiredListProps<T extends string> = {
    'data-w-react-dnd-group-name': string;
    'data-w-react-dnd-list-id': T;
    'data-w-react-dnd-list': 'true';
    'data-w-react-dnd-list-type': ListType['type'];
  };

  export type RequiredItemProps = {
    'data-w-react-dnd-group-name': string;
    'data-w-react-dnd-list-item-id': string;
    'data-w-react-dnd-list-item-index': string;
    'data-w-react-dnd-list-item': 'true';
  };

  export type ListTypeOneCol = {
    type: 'one-col';
  };

  export type ListTypeOneRow = {
    type: 'one-row';
  };

  export type ListTypeGrid = {
    type: 'grid';
    colCount: number;
  };

  export type ListType = ListTypeOneCol | ListTypeOneRow | ListTypeGrid;

  export type DragDestinationInfo<T extends string, E extends HTMLElement> = {
    destinationList: IUseDndManager.PointerDownInfoListInfo<T, E>;
    destinationItemIndex: number;
    destinationItemRect: IsContainCoordinateTargetArea;
  };

  export type DragEndInfo<T extends string, K> = {
    fromListId: T;
    fromItemIndex: number;
    fromWillChangeItems: Array<K>;
    toListId: T;
    toItemIndex: number;
    toWillChangeItems: Array<K>;
    reject: () => void;
    resolve: () => void;
  };

  export type ItemHandlerRequireProps = {
    'data-w-react-dnd-list-item-handler': 'true';
    'data-w-react-dnd-group-name': string;
  };

  export type RenderItem<K> = {
    item: K;
    itemProps: RequiredItemProps;
    itemStyle: CSSProperties;
    itemHandlerProps: ItemHandlerRequireProps;
  };

  export type CursorPositionedInfo = {
    index: number;
    itemArea: IsContainCoordinateTargetArea;
  };

  export type Props<T extends string, K extends RequiredItemStateStructure, E extends HTMLElement> = {
    dndGroupName: string;
    lists: Array<ListInfo<T, K, E>>;
    onDragEnd: (info: DragEndInfo<T, K> | undefined) => void;
    animationDuration: number;
  };
}
