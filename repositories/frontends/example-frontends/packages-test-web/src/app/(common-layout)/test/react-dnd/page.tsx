'use client';

import '@wisdomstar94/react-dnd/style.css';
import { useDndManager } from '@wisdomstar94/react-dnd';
import { useState } from 'react';

type BoardType = 'backlog' | 'processing' | 'done' | 'holding';

type Item = {
  id: string;
  name: string;
  description: string;
};

type BoardItem = {
  id: BoardType;
  label: string;
  items: Item[];
};

export default function Page() {
  const [boards, setBoards] = useState<BoardItem[]>([
    {
      id: 'backlog',
      label: '백로그',
      items: Array.from({ length: 5 }).map((_, index) => {
        const num = index;
        return {
          id: num.toString(),
          name: `작업 ${num}`,
          description: `작업 입니다. ${num}`,
        };
      }),
    },
    {
      id: 'processing',
      label: '진행중',
      items: Array.from({ length: 1 }).map((_, index) => {
        const num = index + 6;
        return {
          id: num.toString(),
          name: `작업 ${num}`,
          description: `작업 입니다. ${num}`,
        };
      }),
    },
    {
      id: 'done',
      label: '완료됨',
      items: Array.from({ length: 5 }).map((_, index) => {
        const num = index + 12;
        return {
          id: num.toString(),
          name: `작업 ${num}`,
          description: `작업 입니다. ${num}`,
        };
      }),
    },
    {
      id: 'holding',
      label: '보류됨',
      items: Array.from({ length: 5 }).map((_, index) => {
        const num = index + 18;
        return {
          id: num.toString(),
          name: `작업 ${num}`,
          description: `작업 입니다. ${num}`,
        };
      }),
    },
  ]);

  const dndManager = useDndManager({
    dndGroupName: 'dndManager',
    lists: [
      {
        id: 'board',
        items: boards,
        setItems: setBoards,
        listType: {
          type: 'one-row',
        },
      },
    ],
    onDragEnd: (info) => {
      console.log('@onDragEnd', info);
      if (info === undefined) {
        return;
      }

      const { fromListId, fromItemIndex, fromWillChangeItems, toListId, toItemIndex, toWillChangeItems, resolve, reject } = info;
      // reject();
      resolve();
    },
    animationDuration: 300,
  });

  const itemsDndManager = useDndManager({
    dndGroupName: 'itemsDndManager',
    lists: [
      {
        id: 'backlog',
        items: boards.find((k) => k.id === 'backlog')?.items ?? [],
        setItems: (items) => {
          console.log('@itemsDndManager.backlog.items', items);
          setBoards((prev) => {
            const newArr = prev.map((item) => {
              if (item.id !== 'backlog') {
                return item;
              }
              return {
                ...item,
                items: Array.isArray(items) ? items : [],
              };
            });
            return newArr;
          });
        },
        listType: {
          type: 'one-col',
        },
      },
      {
        id: 'processing',
        items: boards.find((k) => k.id === 'processing')?.items ?? [],
        setItems: (items) => {
          console.log('@itemsDndManager.processing.items', items);
          setBoards((prev) => {
            const newArr = prev.map((item) => {
              if (item.id !== 'processing') {
                return item;
              }
              return {
                ...item,
                items: Array.isArray(items) ? items : [],
              };
            });
            return newArr;
          });
        },
        listType: {
          type: 'one-col',
        },
      },
      {
        id: 'done',
        items: boards.find((k) => k.id === 'done')?.items ?? [],
        setItems: (items) => {
          setBoards((prev) => {
            const newArr = prev.map((item) => {
              if (item.id !== 'done') {
                return item;
              }
              return {
                ...item,
                items: Array.isArray(items) ? items : [],
              };
            });
            return newArr;
          });
        },
        listType: {
          type: 'one-col',
        },
      },
      {
        id: 'holding',
        items: boards.find((k) => k.id === 'holding')?.items ?? [],
        setItems: (items) => {
          setBoards((prev) => {
            const newArr = prev.map((item) => {
              if (item.id !== 'holding') {
                return item;
              }
              return {
                ...item,
                items: Array.isArray(items) ? items : [],
              };
            });
            return newArr;
          });
        },
        listType: {
          type: 'one-col',
        },
      },
    ],
    onDragEnd(info) {
      console.log('@@@info', info);

      if (info === undefined) {
        return;
      }

      const { resolve, reject } = info;
      resolve();
    },
    animationDuration: 300,
  });

  console.log('boards', boards);

  // useEffect(() => {
  //   console.log('items change 됨..', { backlogItems, processingItems, doneItems });
  // }, [backlogItems, processingItems, doneItems]);

  return (
    <>
      <div className="w-full flex relative">
        {dndManager.renderList('board', (listProps, listStyle, listItems) => {
          return (
            <ul {...listProps} style={{ ...listStyle }} className="w-full flex relative bg-red-200">
              {listItems.map(({ item, itemProps, itemStyle, itemHandlerProps }, index) => {
                return (
                  <li
                    {...itemProps}
                    style={{ ...itemStyle }}
                    key={item.id + '_' + index}
                    className="w-[200px] relative flex flex-col p-2 items-stretch"
                  >
                    <div className="w-full pb-[200px] bg-blue-200 flex items-stretch">
                      <div className="w-full flex justify-end absolute top-3 right-4">{item.label}</div>
                      <div {...itemHandlerProps} className="cursor-pointer inline-flex absolute top-2 left-4 z-[2]">
                        :::
                      </div>
                      {itemsDndManager.renderList(item.id, (childListProps, childListStyle, childListItems) => {
                        return (
                          <div className="p-2 relative w-full flex flex-wrap">
                            <ul
                              {...childListProps}
                              style={{ ...childListStyle }}
                              className="w-full flex flex-col relative mt-5 min-h-[400px] pb-[100px]"
                            >
                              {childListItems.map((childItem, childIndex) => {
                                return (
                                  <li
                                    key={childItem.item.id + '_' + childIndex}
                                    {...childItem.itemProps}
                                    style={{ ...childItem.itemStyle }}
                                    className="w-full flex relative flex-col gap-2 py-0.5"
                                  >
                                    <div className="bg-white relative w-full flex flex-col gap-2">
                                      <div {...childItem.itemHandlerProps} className="cursor-pointer inline-flex absolute top-2 left-4">
                                        :::
                                      </div>
                                      <div className="pt-10">{childItem.item.name}</div>
                                      <div>{childItem.item.description}</div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          );
        })}
      </div>
    </>
  );
}
