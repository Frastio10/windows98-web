const defaultSettings = {
  desktop: {
    icons: {},
  },
};
export const INITIAL_FILES = [
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
];

export const FILE_EXTENSIONS = {
  EXE: "exe",
};
