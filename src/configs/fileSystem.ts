import { iconSize } from "../utils";

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
    name: "WINDOWS",
    isDirectory: true,
    children: [
      {
        name: "settings.json",
        content: JSON.stringify(defaultSettings),
      },
      {
        name: "Desktop",
        isDirectory: true,
        children: [
          {
            name: "Notepad.exe",
            content: "run notepad",
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
