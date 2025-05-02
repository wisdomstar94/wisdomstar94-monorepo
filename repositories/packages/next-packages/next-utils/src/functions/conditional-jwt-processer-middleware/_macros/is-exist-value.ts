export function isExistValue<T>(value: T | undefined | null): value is T {
  if (value === undefined) return false;
  if (value === null) return false;
  return true;
}
