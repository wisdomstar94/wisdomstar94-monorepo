'use client';

import { useMemo, useState } from 'react';
import type { INumberFlow } from './number-flow.interface';
import styles from './number-flow.module.css';

export function NumberFlow(props: INumberFlow.Props) {
  const { value } = props;

  const numberStringArr = useMemo(() => {
    const str = value.toString();
    return str.split('');
  }, [value]);

  function getMinusOneNum(num: number) {
    if (num === 0) {
      return 9;
    }
    return num - 1;
  }

  return (
    <>
      <div className={styles['container']} data-active={true}>
        {numberStringArr.map((numStr, index) => {
          const num = Number(numStr);
          const num_1 = getMinusOneNum(num);
          const num_2 = getMinusOneNum(num_1);
          const num_3 = getMinusOneNum(num_2);

          const transitionDelay = `${index * 0.04}s`;

          return (
            <span
              key={`${numStr}_${index}`}
              className={`${styles['num-unit-container']}`}
              style={{ transitionDelay: transitionDelay }}
            >
              <span style={{ transitionDelay: transitionDelay }}>{numStr}</span>
              <span style={{ transitionDelay: transitionDelay }}>{num_1}</span>
              <span style={{ transitionDelay: transitionDelay }}>{num_2}</span>
              <span style={{ transitionDelay: transitionDelay }}>{num_3}</span>
            </span>
          );
        })}
      </div>
    </>
  );
}
