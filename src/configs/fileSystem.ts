const defaultSettings = {
  desktop: {
    icons: {
      "Notepad.exe": {
        x: Math.round(window.innerWidth - 80),
        y: 10,
      },
    },
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
        name: "Notepad.exe",
        content: "run notepad",
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
