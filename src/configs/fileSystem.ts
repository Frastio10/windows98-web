import { WindowsExplorer } from "../components/Apps";
import { iconSize } from "../utils";
import DEFAULT_REGISTRY from "./registry";

const defaultSettings = {
  desktop: {
    icons: {},
    iconsSrc: {
      txt: [
        iconSize("notepad_file", "small"),
        iconSize("notepad_file", "medium"),
        iconSize("notepad_file", "big"),
      ],
    },
  },
};
export const INITIAL_FILES = [
  {
    name: "My Documents",
    isDirectory: true,
  },
  {
    name: "Program Files",
    isDirectory: true,
    children: [
      {
        name: "Accessories",
        isDirectory: true,
        children: [],
      },
    ],
  },
  {
    name: "vbe_driver",
    isDirectory: true,
    children: [
      {
        name: "Accessories",
        isDirectory: true,
        children: [],
      },
    ],
  },
  {
    name: "WINDOWS",
    isDirectory: true,
    children: [
      {
        name: "settings.json",
        content: JSON.stringify(defaultSettings),
      },
      {
        name: "notepad.exe",
        content: {
          exe: "notepad",
          icon: "notepad",
        },
        isDirectory: false,
      },
      {
        name: "explorer.exe",
        content: {
          exe: "windowsExplorer",
          icon: "directory_explorer",
        },
        isDirectory: false,
      },
      {
        name: "login.exe",
        content: {
          exe: "logInForm",
          icon: "directory_explorer",
        },
        isDirectory: false,
      },
      {
        name: "run.exe",
        content: {
          exe: "run",
          icon: "directory_explorer",
        },
        isDirectory: false,
      },

      {
        name: "System32",
        isDirectory: true,
        children: [
          {
            name: "config",
            isDirectory: true,
            children: [...DEFAULT_REGISTRY],
          },
        ],
      },
      {
        name: "Desktop",
        isDirectory: true,
        children: [
          {
            name: "Notepad.lnk",
            content: {
              target: {
                path: "C:/WINDOWS/notepad.exe",
              },
              icon: {},
            },
          },
          {
            name: "Windows Explorer.lnk",
            content: {
              target: {
                path: "C:/WINDOWS/explorer.exe",
              },
              icon: {},
            },
          },

          {
            name: "CREDITS.txt",
            content:
              "Made with ❤️  by Frastio Agustian\n\nhttps://www.frast.dev\nhttps://github.com/frastio10",
          },
        ],
      },
      {
        name: "Documents",
        isDirectory: true,
      },
      {
        name: "Music",
        isDirectory: true,
      },
    ],
  },
];

export const FILE_EXTENSION = {
  EXE: "exe",
  LNK: "lnk",
};
