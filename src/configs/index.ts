import { LogInForm } from "../components/Apps/LogInForm";

export type WindowPosition = {
  x: number;
  y: number;
}

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

export const AppConfs: WindowSetup[] = [{
  name: "logInForm",
  allowMultipleInstances: true,
  z: 20,
  pos: {
    x: 0,
    y: 0,
  }
}]

export type AppType = "logInForm";

export const apps = {
  logInForm: {
    component: LogInForm,
    defaultTitle: "Welcome to Windows",
    appTitle: 'Notepad',
    useDefaultExtraActions: false,
    defaultPosition: 'center',

    width: 555,
    height: 154,

    isResizable: false,
    isDraggable: true,

    desctopLogo: '',
    minimizedLogo: '/assets/images/notepad-small.png'
  },
};

export const START_MENU_LIST = [
  [
    {
      title: 'Windows Update',
      icon: '/assets/images/windows-update-logo.png',
      appName: 'logInForm',
      isDisabled: true
    }
  ],
  [
    {
      title: 'Programs',
      icon: '/assets/images/dir-programs-logo.png',
      appName: 'logInForm',
      isDisabled: false,
      children: [
        {
          title: 'Notepad',
          icon: '/assets/images/notepad-small.png',
          appName: 'logInForm'
        },
        {
          title: 'Notepad',
          icon: '/assets/images/dir-programs-logo.png',
          appName: 'logInForm'
        }
      ]
    },
    {
      title: 'Favorites',
      icon: '/assets/images/dir-favorites-logo.png',
      appName: 'logInForm',
      isDisabled: true,
      children: [
        {
          title: 'Notepad',
          icon: '/assets/images/dir-programs-logo.png',
          appName: 'logInForm'
        }
      ]
    },
    {
      title: 'Documents',
      icon: '/assets/images/dir-favorites-logo.png',
      appName: 'logInForm',
      isDisabled: true,
      children: [
        {
          title: 'Notepad',
          icon: '/assets/images/dir-programs-logo.png',
          appName: 'logInForm'
        }
      ]
    },
    {
      title: 'Settings',
      icon: '/assets/images/dir-favorites-logo.png',
      appName: 'logInForm',
      isDisabled: true,
      children: [
        {
          title: 'Notepad',
          icon: '/assets/images/dir-programs-logo.png',
          appName: 'logInForm'
        }
      ]
    },
    {
      title: 'Find',
      icon: '/assets/images/dir-favorites-logo.png',
      appName: 'logInForm',
      isDisabled: true,
      children: [
        {
          title: 'Notepad',
          icon: '/assets/images/dir-programs-logo.png',
          appName: 'logInForm'
        }
      ]
    },
    {
      title: 'Help',
      icon: '/assets/images/dir-favorites-logo.png',
      appName: 'logInForm',
      isDisabled: true,
    },
    {
      title: 'Run',
      icon: '/assets/images/dir-favorites-logo.png',
      appName: 'logInForm',
      isDisabled: true,
    }
  ],
  [
    {
      title: 'Windows Update',
      icon: '/assets/images/windows-update-logo.png',
      appName: 'logInForm',
      isDisabled: true
    },
    {
      title: 'Windows Update',
      icon: '/assets/images/windows-update-logo.png',
      appName: 'logInForm',
      isDisabled: true
    }
  ],
]

export const QUICK_LAUNCH_LIST = [
  {
    title: 'Notepad',
    icon: '/assets/images/notepad-small.png',
    appName: 'logInForm'
  },
  {
    title: 'Notepad',
    icon: '/assets/images/notepad-small.png',
    appName: 'logInForm'
  },
{
    title: 'Notepad',
    icon: '/assets/images/notepad-small.png',
    appName: 'logInForm'
  }
]

