import { LogInForm } from "../components/Apps/LogInForm";
import { EmptyComponent } from "../components/shared/EmptyComponent";

export type WindowPosition = {
  x: number;
  y: number;
};

export interface WindowSetup {
  name: AppType;
  z: number;
  allowMultipleInstances: boolean;
  pos: WindowPosition;
}

export interface Window extends WindowSetup {
  windowId: string;
  isFocused: boolean;
}

export const AppConfs: WindowSetup[] = [
  {
    name: "logInForm",
    allowMultipleInstances: true,
    z: 20,
    pos: {
      x: 0,
      y: 0,
    },
  },
];

export type AppType = "logInForm" | "windowsUpdate";

export const APPS = {
  logInForm: {
    component: LogInForm,
    defaultTitle: "Welcome to Windows",
    appTitle: "Notepad",
    useDefaultExtraActions: false,
    defaultPosition: "center",

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
  windowsUpdate: {
    component: EmptyComponent,
    appTitle: "Windows Update",

    icons: [
      "/assets/images/medium/windows-update.png",
      "/assets/images/medium/windows-update.png",
      "/assets/images/medium/windows-update.png",
    ],
  },
  programs: {
    component: EmptyComponent,
    appTitle: "Programs",

    icons: [
      "/assets/images/medium/programs.png",
      "/assets/images/medium/programs.png",
      "/assets/images/medium/programs.png",
    ],
  },
  favorites: {
    component: EmptyComponent,
    appTitle: "Favorites",

    icons: [
      "/assets/images/medium/favorites.png",
      "/assets/images/medium/favorites.png",
      "/assets/images/medium/favorites.png",
    ],
  },
  documents: {
    component: EmptyComponent,
    appTitle: "Documents",

    icons: [
      "/assets/images/medium/directory_open.png",
      "/assets/images/medium/directory_open.png",
      "/assets/images/medium/directory_open.png",
    ],
  },
  settings: {
    component: EmptyComponent,
    appTitle: "Settings",

    icons: [
      "/assets/images/medium/settings_gear.png",
      "/assets/images/medium/settings_gear.png",
      "/assets/images/medium/settings_gear.png",
    ],
  },
  find: {
    component: EmptyComponent,
    appTitle: "Find",

    icons: [
      "/assets/images/medium/search_file_2.png",
      "/assets/images/medium/search_file_2.png",
      "/assets/images/medium/search_file_2.png",
    ],
  },
  help: {
    component: EmptyComponent,
    appTitle: "Help",

    icons: [
      "/assets/images/medium/help_book_small.png",
      "/assets/images/medium/help_book_small.png",
      "/assets/images/medium/help_book_small.png",
    ],
  },
  run: {
    component: EmptyComponent,
    appTitle: "Run",

    icons: [
      "/assets/images/medium/application_hourglass_small.png",
      "/assets/images/medium/application_hourglass_small.png",
      "/assets/images/medium/application_hourglass_small.png",
    ],
  },
  logOff: {
    component: EmptyComponent,
    appTitle: "Log Off...",

    icons: [
      "/assets/images/medium/key_win.png",
      "/assets/images/medium/key_win.png",
      "/assets/images/medium/key_win.png",
    ],
  },
  shutDown: {
    component: EmptyComponent,
    appTitle: "Shut down...",

    icons: [
      "/assets/images/medium/shut_down_normal.png",
      "/assets/images/medium/shut_down_normal.png",
      "/assets/images/medium/shut_down_normal.png",
    ],
  },
};

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
      isDisabled: true,
    },
  ],
];

export const QUICK_LAUNCH_LIST = [
  {
    appName: "logInForm",
  },
  {
    appName: "logInForm",
  },
  {
    appName: "logInForm",
  },
];
