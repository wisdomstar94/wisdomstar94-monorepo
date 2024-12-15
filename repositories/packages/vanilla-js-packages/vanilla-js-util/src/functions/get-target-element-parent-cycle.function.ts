export function getTargetElementParentCycle<T extends HTMLElement>(
  startElement: T | null | undefined,
  condition: (currentElement: HTMLElement) => boolean,
  searchCycleMaxCount?: number
) {
  if (startElement === null || startElement === undefined) return null;

  let currentElement: HTMLElement | null = startElement;
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

export function getTargetElementsParentCycle<T extends HTMLElement>(
  startElement: T | null | undefined,
  condition: (currentElement: HTMLElement) => boolean,
  searchCycleMaxCount?: number
): HTMLElement[] {
  if (startElement === null || startElement === undefined) return [];

  const matchedElements: HTMLElement[] = [];

  let currentElement: HTMLElement | null = startElement;
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
