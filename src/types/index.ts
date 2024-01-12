export type WindowPosition = {
  x: number;
  y: number;
};

export interface AppProps {
  windowData: WindowData;
}

export interface WindowSetup {
  appName: AppName;
  z: number;
  pos: WindowPosition;
}

export interface WindowData extends WindowSetup {
  windowId: string;
  isFocused: boolean;
  title: string;
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
  | "notepad"
  | "shutDown";

export interface App {
  appName: string;
  component: ({ windowData }: AppProps) => JSX.Element;
  showTopBarIcon?: boolean;
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
