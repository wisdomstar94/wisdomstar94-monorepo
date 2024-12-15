export function getHangulConsonant(value: string | undefined | null) {
  const FIRST_CONSONANT_UNICODE = 0x1100; // 초성 유니코드 시작점
  // const LAST_CONSONANT_UNICODE = 0x1112; // 초성 유니코드 끝점

  const CHOSEONG_OFFSET = 0xac00; // '가'의 유니코드 값
  const CHOSEONG_BLOCK_SIZE = 588; // 초성 블록 크기
  // const JUNGSEONG_BLOCK_SIZE = 28; // 중성 블록 크기

  const consonants: string[] = [];

  if (typeof value !== 'string') return consonants;
  if (value.trim() === '') return consonants;

  for (const char of value) {
    const charCode = char.charCodeAt(0);

    // 한글 음절인지 확인
    if (charCode >= 0xac00 && charCode <= 0xd7a3) {
      // 초성 계산
      const consonantIndex = Math.floor((charCode - CHOSEONG_OFFSET) / CHOSEONG_BLOCK_SIZE);
      const consonantUnicode = FIRST_CONSONANT_UNICODE + consonantIndex;

      // 자음을 문자로 변환
      consonants.push(String.fromCharCode(consonantUnicode));
    } else {
      // 한글이 아닌 경우 원래 문자 추가
      consonants.push(char);
    }
  }

  return consonants;
}
