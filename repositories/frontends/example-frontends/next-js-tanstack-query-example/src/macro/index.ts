type MyError = {
  myErrorName: string;
};

export function isMyError(error: unknown): error is MyError {
  if (typeof error !== 'object') return false;
  if (error === null) return false;

  const keys = Object.keys(error);
  if (!keys.includes('myErrorName')) return false;

  return true;
}
