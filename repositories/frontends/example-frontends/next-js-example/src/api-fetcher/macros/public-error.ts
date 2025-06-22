export type PublicError = {
  isPublic: true;
  errorCode: string;
  message: string;
  originalError?: unknown;
};

export function isPublicError(e: unknown): e is PublicError {
  if (typeof e !== 'object' || e === null) return false;
  const keys = Object.keys(e);
  if (!keys.includes('isPublic')) return false;
  if (!keys.includes('errorCode')) return false;
  if (!keys.includes('message')) return false;
  return true;
}

export function createPublicError(props: { errorCode: string; message: string; originalError?: unknown }): PublicError {
  return {
    isPublic: true,
    errorCode: props.errorCode,
    message: props.message,
    originalError: props.originalError,
  };
}
