export declare namespace IUseScrollController {
  export type ElementSelector<T extends Element> = {
    window?: boolean;
    element?: T | null | undefined;
    selector?: string;
  };

  export type Props = {
    isRestoreUnmounted?: boolean;
  };
}
