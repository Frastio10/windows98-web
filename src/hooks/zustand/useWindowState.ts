import { create } from "zustand";
import { APP_LIST, getApp, APP_WINDOW_CONFIG } from "../../configs";
import { INITIAL_Z_INDEX } from "../../configs/constants";
import { AppName, Vector2D, WindowData } from "../../types";

interface WindowState {
  activeWindows: WindowData[];
  minimizedWindows: WindowData[];
  isStartMenuOpen: boolean;

  changeFocus: (windowId: string | null) => void;
  setWindowPos: (windowId: string, newPos: Vector2D) => void;
  openWindow: (windowName: AppName, data?: any) => void;
  minimizeWindow: (windowId: string) => void;
  closeWindow: (windowName: AppName) => void;
  closeWindowById: (windowId: string) => void;
  changeStartMenu: (isOpen?: boolean) => void;
  changeWindowTitle: (windowId: string, newTitle: string) => void;

  closeAllWindows: () => void;
}

export const useWindowState = create<WindowState>((set, get) => ({
  activeWindows: [],
  minimizedWindows: [],
  isStartMenuOpen: false,

  closeAllWindows: () => {
    set({ activeWindows: [] });
  },

  changeStartMenu: (isOpen) => {
    set({ isStartMenuOpen: isOpen || !get().isStartMenuOpen });
  },

  openWindow: (windowName) => {
    const appConfig = APP_WINDOW_CONFIG.find((v) => v.appName === windowName);
    const currentWindows = get().activeWindows;
    const isWindowAlreadyOpened = currentWindows.find(
      (win) => win.appName === windowName,
    );

    const randomNumbers = Math.floor(Math.random() * 9000) + 1000;
    const windowId = `${windowName}_${randomNumbers}`;
    const app = getApp(windowName);
    const title = app.defaultTitle || app.appTitle;

    if (!appConfig || !app)
      return console.log(`App '${windowName}' is not found`);
    if (!app.allowMultipleInstances && isWindowAlreadyOpened) return;

    currentWindows.push({
      ...appConfig,
      isFocused: false,
      isMinimized: false,
      windowId,
      title,
      pos: { x: 0, y: 0 },
    });
    get().changeFocus(windowId);
    set({ activeWindows: currentWindows });
  },

  changeWindowTitle: (windowId, newTitle) => {
    const windows = get().activeWindows;
    windows.forEach((win) => {
      if (windowId === win.windowId) {
        win.title = newTitle;
      }
    });
    set({ activeWindows: windows });
  },

  changeFocus: (windowId) => {
    const windows = get().activeWindows;
    // console.log('closedWindowii', JSON.stringify(windows.map(v => ({ id: v.windowId, x: v.pos.x, y: v.pos.y }))), windowId)
    const maxZ = Math.max(...windows.map((win) => win.z), INITIAL_Z_INDEX);

    if (windowId) {
      const currentWindow = windows.find((win) => win.windowId === windowId);

      if (!currentWindow) return console.log(`Window ${windowId} is not found`);
      if (currentWindow.isFocused) return;
    }

    windows.forEach((win) => {
      win.isFocused = false;

      if (windowId && win.windowId === windowId) {
        win.windowId = windowId;
        win.isFocused = true;
        win.z = maxZ + 1;

        if (win.isMinimized) win.isMinimized = false;
      }
    });

    set({ activeWindows: windows });
  },

  minimizeWindow: (windowId) => {
    const currentMinimizedWindows = get().minimizedWindows;
    const currentActiveWindows = get().activeWindows;

    const windowName = windowId.split("_")[0];
    const app = getApp(windowName as AppName);

    const appConfig = APP_WINDOW_CONFIG.find((v) => v.appName === windowName);
    if (!appConfig || !app) return console.log("App not found");

    currentMinimizedWindows.push({
      ...appConfig,
      isFocused: false,
      isMinimized: true,
      windowId,
      title: app.appTitle || app.defaultTitle!,
    });

    currentActiveWindows.forEach((win) => {
      if (win.windowId === windowId) {
        win.isMinimized = true;
        win.isFocused = false;
      }
    });

    set({
      minimizedWindows: currentMinimizedWindows,
      activeWindows: currentActiveWindows,
    });
  },

  setWindowPos: (windowId, newPos) => {
    const currentWindows = get().activeWindows;
    const currentPos = get().activeWindows.find(
      (win) => win.windowId === windowId,
    )?.pos;

    currentWindows.forEach((v) => {
      if (v.windowId === windowId) {
        v.pos.x = newPos.x;
        v.pos.y = newPos.y;
      }
    });

    set({ activeWindows: currentWindows });
  },

  closeWindow: (windowName) => {
    const currentWindows = get().activeWindows;
    set({
      activeWindows: currentWindows.filter((v) => v.appName !== windowName),
    });
  },

  closeWindowById: (windowId) => {
    const currentWindows = get().activeWindows;
    // get().changeFocus(windowId);
    // console.log("curra", windowId, currentWindows);
    const filtered = currentWindows.filter((v) => v.windowId !== windowId);
    console.log("closing", windowId);
    // console.log("bba",filtered)

    set({
      activeWindows: filtered,
    });
    // console.log("curr", get().activeWindows);
  },
}));
