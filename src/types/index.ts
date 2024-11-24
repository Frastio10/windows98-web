export type Vector2D = {
  x: number;
  y: number;
};

export type FilePath = string;

export type Size = Vector2D;

export interface AppProps<TArgs = any> {
  windowData: WindowData<TArgs>;
}

export interface WindowSetup {
  appName: AppName | string;
  z: number;
  pos: Vector2D;
}

export interface WindowData<TArgs = any> extends WindowSetup {
  windowId: string;
  isFocused: boolean;
  isMinimized: boolean;
  title: string;
  args?: TArgs;
  attachedTo?: string;
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
  | "notepadAlert"
  | "messageBox"
  | "fileDialog"
  | "shutDown"
  | "windowsExplorer";

export interface App {
  appName: AppName | string;
  component: ({ windowData }: AppProps) => JSX.Element;
  showTopBarIcon?: boolean;
  sessionTitle?: string;
  appTitle: string;
  icons: [string, string, string] | null;
  allowMultipleInstances?: boolean;
  defaultTitle?: string;
  useDefaultExtraActions?: boolean;
  defaultPosition?: "center" | "left" | "top" | "bottom" | "right" | string;
  width?: number;
  height?: number;
  isResizable?: boolean;
  isDraggable?: boolean;
}

export type HeadlessApp = Omit<App, "appName" | "component"> & {
  isFocused?: boolean;
  appName: string;
  component: () => JSX.Element;
};
