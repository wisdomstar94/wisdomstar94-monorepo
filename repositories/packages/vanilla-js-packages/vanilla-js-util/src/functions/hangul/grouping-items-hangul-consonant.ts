import { getHangulConsonant } from './';

export type HangulConsonantGroupKey =
  | 'ㄱ'
  | 'ㄲ'
  | 'ㄴ'
  | 'ㄷ'
  | 'ㄸ'
  | 'ㄹ'
  | 'ㅁ'
  | 'ㅂ'
  | 'ㅃ'
  | 'ㅅ'
  | 'ㅆ'
  | 'ㅇ'
  | 'ㅈ'
  | 'ㅉ'
  | 'ㅊ'
  | 'ㅋ'
  | 'ㅌ'
  | 'ㅍ'
  | 'ㅎ'
  | 'others';

export type HangulConsonantGroupItem<T> = {
  consonant: HangulConsonantGroupKey;
  list: T[];
};

export function groupingItemsHangulConsonant<T>(list: T[], targetString: (item: T) => string) {
  const grouping: HangulConsonantGroupItem<T>[] = [
    {
      consonant: 'ㄱ',
      list: [],
    },
    {
      consonant: 'ㄲ',
      list: [],
    },
    {
      consonant: 'ㄴ',
      list: [],
    },
    {
      consonant: 'ㄷ',
      list: [],
    },
    {
      consonant: 'ㄸ',
      list: [],
    },
    {
      consonant: 'ㄹ',
      list: [],
    },
    {
      consonant: 'ㅁ',
      list: [],
    },
    {
      consonant: 'ㅂ',
      list: [],
    },
    {
      consonant: 'ㅃ',
      list: [],
    },
    {
      consonant: 'ㅅ',
      list: [],
    },
    {
      consonant: 'ㅆ',
      list: [],
    },
    {
      consonant: 'ㅇ',
      list: [],
    },
    {
      consonant: 'ㅈ',
      list: [],
    },
    {
      consonant: 'ㅉ',
      list: [],
    },
    {
      consonant: 'ㅊ',
      list: [],
    },
    {
      consonant: 'ㅋ',
      list: [],
    },
    {
      consonant: 'ㅌ',
      list: [],
    },
    {
      consonant: 'ㅍ',
      list: [],
    },
    {
      consonant: 'ㅎ',
      list: [],
    },
    {
      consonant: 'others',
      list: [],
    },
  ];

  for (const item of list) {
    const target = targetString(item);
    const consonants = getHangulConsonant(target);
    // console.log('consonants[0]', { v: consonants[0] });
    const findGroup = grouping.find((x) => {
      // return x.consonant.localeCompare(consonants[0]) === 1;
      return x.consonant.normalize('NFKC') === consonants[0].normalize('NFKC');
    });
    const othersGroup = grouping.find((x) => x.consonant === 'others');
    if (findGroup !== undefined) {
      findGroup.list.push(item);
    } else {
      othersGroup?.list.push(item);
    }
  }

  return grouping;
}
