export declare namespace IUseAddEventListener {
  export type SelectorString = `selector:${string}`;

  export type Target<E extends HTMLElement> = { current: E | null } | SelectorString;

  export interface DomEventRequiredInfo<K extends keyof HTMLElementEventMap, E extends HTMLElement> {
    target: Target<E>;
    eventName: K;
    eventListener: (event: HTMLElementEventMap[K]) => unknown;
    options?: boolean | AddEventListenerOptions;
  }

  export interface WindowEventRequiredInfo<T extends keyof WindowEventMap> {
    eventName: T;
    eventListener: (event: WindowEventMap[T]) => unknown;
    options?: boolean | AddEventListenerOptions;
  }

  export interface Props<K extends keyof HTMLElementEventMap, T extends keyof WindowEventMap, E extends HTMLElement> {
    domEventRequiredInfo?: DomEventRequiredInfo<K, E>;
    windowEventRequiredInfo?: WindowEventRequiredInfo<T>;
  }
}
