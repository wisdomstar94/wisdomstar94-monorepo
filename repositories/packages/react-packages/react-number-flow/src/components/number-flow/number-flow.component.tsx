'use client';

import { useEffect, useMemo, useState } from 'react';
import type { INumberFlow } from './number-flow.interface';
import styles from './number-flow.module.css';

export function NumberFlow(props: INumberFlow.Props) {
  const { value } = props;
  const [timestamp, setTimestamp] = useState(0);

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

  useEffect(() => {
    setTimestamp(Date.now());
  }, [value]);

  return (
    <>
      <div
        className={styles['container']}
        data-active={true}
        style={{ visibility: timestamp === 0 ? 'hidden' : undefined }}
      >
        {numberStringArr.map((numStr, index) => {
          const num = Number(numStr);
          const num_1 = getMinusOneNum(num);
          const num_2 = getMinusOneNum(num_1);
          const num_3 = getMinusOneNum(num_2);
          const num_4 = getMinusOneNum(num_3);

          const transitionDelay = `${index * 0.05}s`;

          return (
            <span
              key={`${numStr}_${index}_${timestamp}`}
              className={`${styles['num-unit-container']}`}
              style={{ transitionDelay: transitionDelay }}
            >
              <span style={{ transitionDelay: transitionDelay }}>{numStr}</span>
              <span style={{ transitionDelay: transitionDelay }}>{num_1}</span>
              <span style={{ transitionDelay: transitionDelay }}>{num_2}</span>
              <span style={{ transitionDelay: transitionDelay }}>{num_3}</span>
              <span style={{ transitionDelay: transitionDelay }}>{num_4}</span>
            </span>
          );
        })}
      </div>
    </>
  );
}
