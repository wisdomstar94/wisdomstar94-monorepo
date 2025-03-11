'use client';

import '@wisdomstar94/react-dnd/style.css';
import { useDndManager } from '@wisdomstar94/react-dnd';
import { useEffect, useRef, useState } from 'react';

type HobbyItem = {
  id: string;
  title: string;
};

type CharacterItem = {
  id: string;
  name: string;
};

export default function Page() {
  const [number, setNumber] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  // console.log('@@ number', number);

  const characterListScrollContainerRef = useRef<HTMLDivElement>(null);

  const [hobbyItems, setHobbyItems] = useState<HobbyItem[]>([
    {
      id: '1',
      title: '독서',
    },
    {
      id: '2',
      title: '게임',
    },
    {
      id: '3',
      title: '산책',
    },
    {
      id: '4',
      title: '수영',
    },
    {
      id: '5',
      title: '등산',
    },
  ]);

  const [characterItems, setCharacterItems] = useState<CharacterItem[]>([
    {
      id: '1',
      name: '다오',
    },
    {
      id: '2',
      name: '배찌',
    },
    {
      id: '3',
      name: '마리드',
    },
    {
      id: '4',
      name: '디지니',
    },
    {
      id: '5',
      name: '케피',
    },
    {
      id: '6',
      name: '모스',
    },
  ]);

  const myHobbyGroupDndManager = useDndManager({
    dndGroupName: 'my-bobby-group',
    lists: [
      {
        id: 'habbit-list',
        listType: {
          type: 'one-col',
        },
        items: hobbyItems,
        setItems: setHobbyItems,
      },
    ],
    getItemUniqueId: (item) => item.id,
    animationDuration: 300,
    onDragEnd(info) {
      console.log('info', info);
      if (info === undefined) {
        return;
      }

      const { resolve } = info;
      resolve();
    },
  });

  const myCharacterDndManager = useDndManager({
    dndGroupName: 'my-character-group',
    lists: [
      {
        id: 'character-list',
        listType: {
          type: 'one-row',
        },
        items: characterItems,
        setItems: setCharacterItems,
        scrollContainerElementSelector: {
          element: characterListScrollContainerRef.current,
        },
      },
    ],
    getItemUniqueId: (item) => item.id,
    animationDuration: 300,
    onDragEnd(info) {
      console.log('info', info);
      if (info === undefined) {
        return;
      }

      const { resolve } = info;
      resolve();
    },
  });

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setNumber((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      <div className="w-full flex gap-2">
        <div className="flex-[1] min-h-[700px] bg-blue-200">{number}</div>
        <div className="flex-[2] flex min-w-0 flex-col gap-2 bg-green-200">
          <div className="w-full h-auto p-4 bg-red-200">
            {myHobbyGroupDndManager.renderList('habbit-list', (listProps, listStyle, listItems) => {
              return (
                <ul {...listProps} style={{ ...listStyle }} className="w-full relative">
                  {listItems.map((listItem, itemIndex) => {
                    const { item, itemHandlerProps, itemProps, itemStyle } = listItem;
                    return (
                      <li
                        key={`${item.id}_${itemIndex}`}
                        {...itemProps}
                        style={{ ...itemStyle }}
                        className="w-full py-0.5 relative"
                      >
                        <div className="w-full bg-red-400">
                          <div {...itemHandlerProps}>:::</div>
                          <div>{item.title}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              );
            })}
          </div>
          <div
            className="w-full min-w-0 p-4 bg-purple-200 h-[200px] overflow-scroll"
            ref={characterListScrollContainerRef}
          >
            {myCharacterDndManager.renderList('character-list', (listProps, listStyle, listItems) => {
              return (
                <ul {...listProps} style={{ ...listStyle }} className="w-full relative">
                  {listItems.map((listItem, itemIndex) => {
                    const { item, itemHandlerProps, itemProps, itemStyle } = listItem;
                    return (
                      <li
                        key={`${item.id}_${itemIndex}`}
                        {...itemProps}
                        style={{ ...itemStyle, width: '200px' }}
                        className="w-full py-0.5 relative"
                      >
                        <div className="w-full bg-red-400">
                          <div {...itemHandlerProps}>:::</div>
                          <div>{item.name}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
