export type ArrayFormatTypeOneProperty = {
  type: 'oneProperty';
  divider: string;
};

export type ArrayFormatTypeMultipleProperty = {
  type: 'multipleProperty';
};

export type ArrayFormat = ArrayFormatTypeOneProperty | ArrayFormatTypeMultipleProperty;

export type ToQueryStringOptions = {
  excludeProperties?: string[];
  arrayFormat?: ArrayFormat; // default 는 { type: 'oneProperty', divider: ',' }
};

export function toQueryString<T>(payload: T, options?: ToQueryStringOptions) {
  const excludeProperties = options?.excludeProperties ?? ['_params'];
  const arrayFormat = options?.arrayFormat ?? {
    type: 'oneProperty',
    divider: ',',
  };

  if (typeof payload !== 'object') {
    throw new Error('Payload must be an object');
  }

  if (payload === null) {
    return '';
  }

  const pairKeyValues: string[] = [];

  const payloadEntries = Object.entries(payload);
  for (const [key, value] of payloadEntries) {
    if (excludeProperties.includes(key)) {
      continue;
    }

    if (typeof value === 'string') {
      disposeString(key, value, pairKeyValues);
    } else if (typeof value === 'number') {
      disposeNumber(key, value, pairKeyValues);
    } else if (Array.isArray(value)) {
      disposeArray(key, value, pairKeyValues, arrayFormat);
    }
  }

  if (pairKeyValues.length === 0) {
    return '';
  }

  return '?' + pairKeyValues.join('&');
}

function disposeString(key: string, value: string, pairKeyValues: string[]) {
  pairKeyValues.push(`${key}=${value}`);
}

function disposeNumber(key: string, value: number, pairKeyValues: string[]) {
  pairKeyValues.push(`${key}=${value}`);
}

function disposeArray(
  key: string,
  value: (string | number)[],
  pairKeyValues: string[],
  arrayFormat: ArrayFormat
) {
  if (arrayFormat.type === 'oneProperty') {
    const divider = arrayFormat.divider;
    const convertValue = value.join(divider);
    pairKeyValues.push(`${key}=${convertValue}`);
  } else if (arrayFormat.type === 'multipleProperty') {
    for (const item of value) {
      pairKeyValues.push(`${key}=${item}`);
    }
  }
}
