export declare namespace IUseScrollController {
  export type ElementSelector<T extends HTMLElement> = {
    window?: boolean;
    element?: T | null | undefined;
    selector?: string;
  };

  export type Props = {
    isRestoreUnmounted?: boolean;
  };
}
