export type UrlQueryStringItemMode = 'UPSERT' | 'DELETE' | 'TRUNCATE' | 'REPLACE';

export type UrlQueryStringItem = {
  key: string;
  value: [string] | string[];
  isArray?: boolean;
  mode: UrlQueryStringItemMode;
};

export type GenerateQueryStringUrlProps = {
  queryString: string;
  items: UrlQueryStringItem[];
  arrayDivider?: string;
};

export function generateQueryStringUrl(props: GenerateQueryStringUrlProps) {
  const { arrayDivider } = props;

  const queryString = decodeURIComponent(props.queryString.startsWith('?') ? props.queryString.replace('?', '') : props.queryString); // ex) a=b&c=d
  const queryStringSplit = queryString.split('&');

  const map = new Map<string, string[]>();

  for (const item of queryStringSplit) {
    const [key, value] = item.split('=');

    const convertValue = typeof arrayDivider === 'string' ? value.split(arrayDivider) : [value];

    if (map.has(key)) {
      const v = map.get(key) ?? [];
      map.set(key, v.concat(convertValue));
    } else {
      map.set(key, convertValue);
    }
  }

  for (const item of props.items) {
    const { key, value, isArray, mode } = item;

    if (mode === 'DELETE') {
      map.delete(key);
    } else if (mode === 'REPLACE') {
      map.set(key, value);
    } else if (mode === 'UPSERT') {
      if (isArray === true) {
        if (map.has(key)) {
          const v = map.get(key) ?? [];
          map.set(key, v.concat(value));
        } else {
          map.set(key, value);
        }
      } else {
        map.set(key, value);
      }
    }
  }

  const queryStringPairItems: string[] = [];
  for (const [key, value] of Array.from(map.entries())) {
    if (typeof arrayDivider === 'string') {
      if (value.length === 1) {
        queryStringPairItems.push(`${key}=${value[0]}`);
      } else {
        queryStringPairItems.push(`${key}=${value.join(arrayDivider)}`);
      }
    } else {
      for (const v of value) {
        queryStringPairItems.push(`${key}=${v}`);
      }
    }
  }

  if (queryStringPairItems.length === 0) return '';

  return `?${queryStringPairItems.join('&')}`;
}
