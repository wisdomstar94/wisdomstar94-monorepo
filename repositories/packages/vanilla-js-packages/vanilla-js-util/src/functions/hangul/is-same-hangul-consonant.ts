export function isSameHangulConsonant(value1: string, value2: string) {
  return value1.normalize('NFKC') === value2.normalize('NFKC');
}
