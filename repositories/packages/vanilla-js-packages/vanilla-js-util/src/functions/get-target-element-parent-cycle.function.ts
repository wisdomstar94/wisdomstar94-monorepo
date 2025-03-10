export function getTargetElementParentCycle<T extends Element>(
  startElement: T | null | undefined,
  condition: (currentElement: Element) => boolean,
  searchCycleMaxCount?: number
) {
  if (startElement === null || startElement === undefined) return null;

  let currentElement: Element | null = startElement;
  let searchCycleCount = 0;
  while (currentElement !== null) {
    if (condition(currentElement)) {
      break;
    }

    if (searchCycleMaxCount !== undefined && searchCycleCount > searchCycleMaxCount) {
      currentElement = null;
      break;
    }

    currentElement = currentElement.parentElement;
    searchCycleCount++;
  }

  return currentElement;
}

export function getTargetElementsParentCycle<T extends Element>(
  startElement: T | null | undefined,
  condition: (currentElement: Element) => boolean,
  searchCycleMaxCount?: number
): Element[] {
  if (startElement === null || startElement === undefined) return [];

  const matchedElements: Element[] = [];

  let currentElement: Element | null = startElement;
  let searchCycleCount = 0;
  while (currentElement !== null) {
    if (condition(currentElement)) {
      matchedElements.push(currentElement);
    }

    if (searchCycleMaxCount !== undefined && searchCycleCount > searchCycleMaxCount) {
      currentElement = null;
      break;
    }

    currentElement = currentElement.parentElement;
    searchCycleCount++;
  }

  return matchedElements;
}
