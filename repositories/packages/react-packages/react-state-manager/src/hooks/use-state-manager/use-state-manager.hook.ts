'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { IUseStateManager } from './use-state-manager.interface';

export function useStateManager<T>(initialState: IUseStateManager.Props<T>) {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(initialState);
  const [prevState, setPrevState] = useState<T | undefined>(undefined);

  const customSetState: Dispatch<SetStateAction<T>> = (v) => {
    setState(v);
    if (typeof v !== 'function') {
      stateRef.current = v;
    }
  };

  function getRefState() {
    return stateRef.current;
  }

  useEffect(() => {
    setPrevState(state);
  }, [state]);

  return [state, customSetState, prevState, getRefState] as const;
}
