import { IUseScrollController } from './use-scroll-controller.types';

export function getTargetElementFromElementSelector<T extends Element>(
  elementSelector: IUseScrollController.ElementSelector<T> | undefined | null
) {
  if (elementSelector === undefined || elementSelector === null) return null;
  const { window, element, selector } = elementSelector;
  if (window === true) return document.querySelector<Element>('html');
  if (element !== undefined && element !== null) return element;
  if (typeof selector === 'string') return document.querySelector<Element>(selector);
  return null;
}
