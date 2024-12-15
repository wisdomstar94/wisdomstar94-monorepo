import { IUseScrollController } from './use-scroll-controller.types';

export function getTargetElementFromElementSelector<T extends HTMLElement>(
  elementSelector: IUseScrollController.ElementSelector<T> | undefined | null
) {
  if (elementSelector === undefined || elementSelector === null) return null;
  const { window, element, selector } = elementSelector;
  if (window === true) return document.querySelector<HTMLElement>('html');
  if (element !== undefined && element !== null) return element;
  if (typeof selector === 'string') return document.querySelector<HTMLElement>(selector);
  return null;
}
