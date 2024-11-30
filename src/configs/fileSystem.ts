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
            name: "Notepad.exe",
            content: {
              exe: "notepad",
              icon: "notepad",
            },
            isDirectory: false,
          },
          {
            name: "Windows Explorer.exe",
            content: "run windowsExplorer",
            isDirectory: false,
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

export const FILE_EXTENSIONS = {
  EXE: "exe",
};
