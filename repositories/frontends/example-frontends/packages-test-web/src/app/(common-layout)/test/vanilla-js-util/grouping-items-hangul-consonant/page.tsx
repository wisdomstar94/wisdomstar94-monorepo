'use client';

import { getHangulConsonant, groupingItemsHangulConsonant } from '@wisdomstar94/vanilla-js-util';

type MyITem = {
  extra: {
    name: string;
  };
  age: number;
  gender: 'male' | 'female';
};

export default function Page() {
  const consonants = getHangulConsonant('ppp');
  const consonantsFirst = consonants[0];

  console.log('char =>', consonantsFirst);
  console.log(`'ㄱ'.localeCompare(char) =>`, 'ㄱ'.localeCompare(consonantsFirst));

  const originalItems: MyITem[] = [
    {
      extra: {
        name: '삼성전자',
      },
      age: 30,
      gender: 'male',
    },
    {
      extra: {
        name: '아따맘마',
      },
      age: 30,
      gender: 'female',
    },
    {
      extra: {
        name: '새싹비빔밥',
      },
      age: 27,
      gender: 'male',
    },
    {
      extra: {
        name: '뷁뤡뒑',
      },
      age: 30,
      gender: 'male',
    },
    {
      extra: {
        name: '계란',
      },
      age: 30,
      gender: 'male',
    },
    {
      extra: {
        name: '마라탕',
      },
      age: 30,
      gender: 'male',
    },
    {
      extra: {
        name: 'power',
      },
      age: 30,
      gender: 'male',
    },
  ];
  const groupingConsonantItemsList = groupingItemsHangulConsonant(originalItems, (item) => item.extra.name);

  console.log('@groupingConsonantItemsList', groupingConsonantItemsList);

  return (
    <>
      <ul className="w-full flex flex-col gap-2 relative items-start mb-40">
        {groupingConsonantItemsList.map((consonantItem, consonantItemIndex) => {
          return (
            <div key={consonantItemIndex} className="w-full relative flex flex-col border border-slate-500 rounded-lg overflow-hidden">
              <div className="w-full px-2 py-0.5 bg-slate-200 border-b border-slate-500">{consonantItem.consonant}</div>
              <div className="w-full flex gap-2 flex-wrap relative px-2 py-2">
                {consonantItem.list.map((item, index) => {
                  return (
                    <div key={index} className="inline-flex px-2 py-0.5 border border-slate-500 rounded-lg text-xs">
                      {item.extra.name}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </ul>
    </>
  );
}
