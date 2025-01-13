'use client';

import { useState } from 'react';
import { IVisibleObserverBox, VisibleObserverBox } from '../../components';

export function useVisibleObserver() {
  const [visibleMap, setVisibleMap] = useState<Map<number, boolean>>(new Map());
  const activeIndex = (function () {
    const arrayMap = Array.from(visibleMap.entries());
    const visibledIndexArray: number[] = [];
    for (const [index, isVisible] of arrayMap) {
      if (isVisible) {
        visibledIndexArray.push(index);
      }
    }
    if (visibledIndexArray.length === 0) {
      return -1;
    }
    return Math.min(...visibledIndexArray);
  })();

  return {
    visibleObserverBox: (props: IVisibleObserverBox.Props) => {
      return (
        <VisibleObserverBox
          {...props}
          key={props.customKey}
          onChangeVisibility={(isVisible) => {
            setVisibleMap((prev) => {
              const newMap = new Map(prev);
              newMap.set(props.index, isVisible);
              return newMap;
            });
            if (typeof props.onChangeVisibility === 'function') {
              props.onChangeVisibility(isVisible);
            }
          }}
        />
      );
    },
    activeIndex,
  };
}
