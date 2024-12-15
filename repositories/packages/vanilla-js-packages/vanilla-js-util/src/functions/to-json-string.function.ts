export type ToJsonStringOptions = {
  excludeProperties?: string[];
};

export function toJsonString(payload: unknown, options?: ToJsonStringOptions) {
  const excludeProperties = options?.excludeProperties ?? [];

  if (payload === null) return `{}`;
  if (typeof payload !== 'object') return `{}`;

  const newObj = { ...payload } as Record<string, unknown>;
  for (const excludeProperty of excludeProperties) {
    delete newObj[excludeProperty];
  }

  return JSON.stringify(newObj);
}
