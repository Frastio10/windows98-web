import { AppName, App, WindowSetup } from "../types";
import { EmptyComponent } from "../components/shared/EmptyComponent";
import { Run, LogInForm, ShutDown, Notepad } from "../components/Apps";
import {
  DEFAULT_WINDOW_HEIGHT,
  DEFAULT_WINDOW_WIDTH,
  INITIAL_Z_INDEX,
} from "./constants";

export const getApp = (appName: AppName): App => {
  const app = APP_LIST.find((app) => app.appName === appName)!;
  // if (!app) return console.log(`${appName} is not a valid app!`);

  return app;
};

export const APP_WINDOW_CONFIG: WindowSetup[] = [
  {
    appName: "logInForm",
    z: INITIAL_Z_INDEX,
    pos: {
      x: 0,
      y: 0,
    },
  },
  {
    appName: "run",
    z: INITIAL_Z_INDEX,
    pos: {
      x: window.innerWidth,
      y: window.innerHeight,
    },
  },
  {
    appName: "shutDown",
    z: INITIAL_Z_INDEX,
    pos: {
      x: 0,
      y: 0,
    },
  },
  {
    appName: "notepad",
    z: INITIAL_Z_INDEX,
    pos: {
      x: 0,
      y: 0,
    },
  },
];

export const APP_LIST: App[] = [
  {
    appName: "logInForm",
    component: LogInForm,
    defaultTitle: "Welcome to Windows",
    appTitle: "Notepad",
    showTopBarIcon: false,
    useDefaultExtraActions: false,
    defaultPosition: "center",
    allowMultipleInstances: true,
    width: 555,
    height: 154,
    isResizable: false,
    isDraggable: true,
    icons: [
      "/assets/images/notepad-small.png", // small -> minimized icons
      "/assets/images/notepad-small.png", // medium -> other stuffs
      "/assets/images/notepad-small.png", // large -> desktop icon
    ],
  },
  {
    appName: "notepad",
    component: Notepad,
    defaultTitle: "Untitled",
    appTitle: "Notepad",
    useDefaultExtraActions: false,
    defaultPosition: "center",
    allowMultipleInstances: true,
    width: 500,
    height: 600,
    isResizable: true,
    isDraggable: true,
    icons: [
      "/assets/images/notepad-small.png", // small -> minimized icons
      "/assets/images/notepad-small.png", // medium -> other stuffs
      "/assets/images/notepad-small.png", // large -> desktop icon
    ],
  },
  {
    appName: "run",
    component: Run,
    appTitle: "Run",
    width: 390,
    height: 170,
    useDefaultExtraActions: true,
    defaultPosition: `0 ${window.innerHeight - 170 - 30}`,
    allowMultipleInstances: false,
    isResizable: false,
    isDraggable: true,
    icons: [
      "/assets/images/medium/application_hourglass_small.png",
      "/assets/images/medium/application_hourglass_small.png",
      "/assets/images/medium/application_hourglass_small.png",
    ],
  },
  {
    appName: "windowsUpdate",
    component: EmptyComponent,
    appTitle: "Windows Update",
    icons: [
      "/assets/images/medium/windows-update.png",
      "/assets/images/medium/windows-update.png",
      "/assets/images/medium/windows-update.png",
    ],
  },
  {
    appName: "programs",
    component: EmptyComponent,
    appTitle: "Programs",
    icons: [
      "/assets/images/medium/programs.png",
      "/assets/images/medium/programs.png",
      "/assets/images/medium/programs.png",
    ],
  },
  {
    appName: "favorites",
    component: EmptyComponent,
    appTitle: "Favorites",
    icons: [
      "/assets/images/medium/favorites.png",
      "/assets/images/medium/favorites.png",
      "/assets/images/medium/favorites.png",
    ],
  },
  {
    appName: "documents",
    component: EmptyComponent,
    appTitle: "Documents",
    icons: [
      "/assets/images/medium/directory_open.png",
      "/assets/images/medium/directory_open.png",
      "/assets/images/medium/directory_open.png",
    ],
  },
  {
    appName: "settings",
    component: EmptyComponent,
    appTitle: "Settings",
    icons: [
      "/assets/images/medium/settings_gear.png",
      "/assets/images/medium/settings_gear.png",
      "/assets/images/medium/settings_gear.png",
    ],
  },
  {
    appName: "find",
    component: EmptyComponent,
    appTitle: "Find",
    icons: [
      "/assets/images/medium/search_file_2.png",
      "/assets/images/medium/search_file_2.png",
      "/assets/images/medium/search_file_2.png",
    ],
  },
  {
    appName: "help",
    component: EmptyComponent,
    appTitle: "Help",
    icons: [
      "/assets/images/medium/help_book_small.png",
      "/assets/images/medium/help_book_small.png",
      "/assets/images/medium/help_book_small.png",
    ],
  },
  {
    appName: "logOff",
    component: EmptyComponent,
    appTitle: "Log Off...",
    icons: [
      "/assets/images/medium/key_win.png",
      "/assets/images/medium/key_win.png",
      "/assets/images/medium/key_win.png",
    ],
  },
  {
    appName: "shutDown",
    defaultTitle: "Shutting down...",
    component: ShutDown,
    appTitle: "Shut down...",
    icons: [
      "/assets/images/medium/shut_down_normal.png",
      "/assets/images/medium/shut_down_normal.png",
      "/assets/images/medium/shut_down_normal.png",
    ],
  },
];

export const START_MENU_LIST = [
  [
    {
      appName: "windowsUpdate",
      isDisabled: true,
      children: [
        {
          appName: "logInForm",
        },
        {
          appName: "logInForm",
        },
      ],
    },
  ],
  [
    {
      appName: "programs",
      isDisabled: false,
      children: [
        {
          appName: "logInForm",
        },
        {
          appName: "logInForm",
        },
      ],
    },
    {
      appName: "favorites",
      isDisabled: true,
      children: [
        {
          appName: "logInForm",
        },
      ],
    },
    {
      appName: "documents",
      isDisabled: true,
      children: [
        {
          appName: "logInForm",
        },
      ],
    },
    {
      appName: "settings",
      isDisabled: true,
      children: [
        {
          appName: "logInForm",
        },
      ],
    },
    {
      appName: "find",
      isDisabled: true,
      children: [
        {
          appName: "logInForm",
        },
      ],
    },
    {
      appName: "help",
      isDisabled: true,
    },
    {
      appName: "run",
      isDisabled: false,
    },
  ],
  [
    {
      appName: "logOff",
      isDisabled: true,
    },
    {
      appName: "shutDown",
      isDisabled: false,
    },
  ],
];

export const QUICK_LAUNCH_LIST = [
  {
    appName: "notepad",
  },
  {
    appName: "notepad",
  },
  {
    appName: "logInForm",
  },
];
