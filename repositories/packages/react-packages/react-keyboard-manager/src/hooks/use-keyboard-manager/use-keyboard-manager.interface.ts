export declare namespace IUseKeyboardManager {
  export interface Props {
    onChangeKeyMapStatus?: (keyMap: Map<string, boolean>) => void;
    onUp?: (keyMap: Map<string, boolean>) => void;
    onDown?: (keyMap: Map<string, boolean>) => void;
    onLeft?: (keyMap: Map<string, boolean>) => void;
    onRight?: (keyMap: Map<string, boolean>) => void;
    onUpLeft?: (keyMap: Map<string, boolean>) => void;
    onUpRight?: (keyMap: Map<string, boolean>) => void;
    onDownLeft?: (keyMap: Map<string, boolean>) => void;
    onDownRight?: (keyMap: Map<string, boolean>) => void;
    onRelease?: (keyMap: Map<string, boolean>) => void;
    onJump?: (keyMap: Map<string, boolean>) => void;
  }
}
