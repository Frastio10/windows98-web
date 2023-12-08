export type WindowPosition = {
  x: number;
  y: number;
};

export interface WindowSetup {
  appName: AppName;
  z: number;
  pos: WindowPosition;
}

export interface Window extends WindowSetup {
  windowId: string;
  isFocused: boolean;
}

export type AppName =
  | "logInForm"
  | "windowsUpdate"
  | "programs"
  | "favorites"
  | "documents"
  | "settings"
  | "find"
  | "help"
  | "run"
  | "logOff"
  | "shutDown";

export interface App {
  appName: string;
  component: () => JSX.Element;
  appTitle: string;
  icons: [string, string, string];
  allowMultipleInstances?: boolean;
  defaultTitle?: string;
  useDefaultExtraActions?: boolean;
  defaultPosition?: "center" | "left" | "top" | "bottom" | "right" | string;
  width?: number;
  height?: number;
  isResizable?: boolean;
  isDraggable?: boolean;
}
