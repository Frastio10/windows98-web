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
    name: "Pictures",
    isDirectory: true,
    children: [],
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
        name: "camera.exe",
        content: {
          exe: "camera",
          icon: "camera",
          url: "../components/Apps/Camera",
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
          // icon: "directory_explorer",
        },
        isDirectory: false,
      },
      {
        name: "run.exe",
        content: {
          exe: "run",
          // icon: "directory_explorer",
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
            name: "Camera.lnk",
            content: {
              target: {
                path: "C:/WINDOWS/camera.exe",
              },
              icon: {},
            },
          },

          {
            name: "CREDITS.txt",
            content:
              "Made with ❤️  by Frastio Agustian\n\nhttps://www.frast.dev\nhttps://github.com/frastio10",
          },

          {
            name: "Why Though.txt",
            content:
              "\nMay 7, 2023\n\nI’ve always loved the retro glow,\nA time I’ve never lived to know.\nWindows 98, a vintage scene,\nChunky icons, colors serene.\n\nThe startup chime, a soothing call,\nA simpler time—I feel it all.\nNot born to see its early light,\nBut here I am, caught in its sight.\n\nSo I built this world, a simulation,\nA nod to tech’s old foundation.\nTo push my skills, React and UI,\nAnd watch nostalgia come alive.\n\nA time machine, a challenge too,\nWindows 98, reborn anew.\n\n- Frastio Agustian -",
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
