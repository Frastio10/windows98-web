import { create } from "zustand";
import { getApp, APP_WINDOW_CONFIG } from "../../configs";
import { INITIAL_Z_INDEX } from "../../configs/constants";
import { logger } from "../../libs/logger";
import { AppName, Vector2D, WindowData } from "../../types";
import { log } from "../../utils";

interface WindowState {
  activeWindows: WindowData[];
  minimizedWindows: WindowData[];
  isStartMenuOpen: boolean;

  changeFocus: (windowId: string | null) => void;
  setWindowPos: (windowId: string, newPos: Vector2D) => void;
  openWindow: (windowName: AppName, args?: any) => void;
  minimizeWindow: (windowId: string) => void;
  closeWindow: (windowName: AppName) => void;
  closeWindowById: (windowId: string) => void;
  changeStartMenu: (isOpen?: boolean) => void;
  changeWindowTitle: (windowId: string, newTitle?: string | null) => void;

  closeAllWindows: () => void;
}

export const useWindow = create<WindowState>((set, get) => ({
  activeWindows: [],
  minimizedWindows: [],
  isStartMenuOpen: false,

  closeAllWindows: () => {
    set({ activeWindows: [] });
  },

  changeStartMenu: (isOpen) => {
    set({ isStartMenuOpen: isOpen || !get().isStartMenuOpen });
  },

  openWindow: (windowName, args) => {
    const appConfig = APP_WINDOW_CONFIG.find((v) => v.appName === windowName);
    const currentWindows = get().activeWindows;
    const isWindowAlreadyOpened = currentWindows.find(
      (win) => win.appName === windowName,
    );

    const randomNumbers = Math.floor(Math.random() * 9000) + 1000;
    const windowId = `${windowName}_${randomNumbers}`;
    const app = getApp(windowName);

    if (!appConfig || !app)
      return logger.log(`[OPEN] App '${windowName}' is not found`);
    if (!app.allowMultipleInstances && isWindowAlreadyOpened) return;

    const title = app.defaultTitle || app.appTitle;

    currentWindows.push({
      ...appConfig,
      z: appConfig?.z || INITIAL_Z_INDEX,
      appName: appConfig?.appName || app.appName,
      isFocused: false,
      isMinimized: false,
      windowId,
      title,
      args,
      pos: { x: 0, y: 0 },
    });
    get().changeFocus(windowId);
    set({ activeWindows: currentWindows });
  },

  changeWindowTitle: (windowId, newTitle) => {
    const windows = get().activeWindows;
    windows.forEach((win) => {
      if (windowId === win.windowId) {
        const app = getApp(win.appName);
        if (!app) return logger.log("Failed to open file");

        win.title =
          newTitle ||
          app.sessionTitle ||
          app.defaultTitle ||
          app.appTitle ||
          "";
      }
    });
    set({ activeWindows: windows });
  },

  changeFocus: (windowId) => {
    const windows = get().activeWindows;
    const maxZ = Math.max(...windows.map((win) => win.z), INITIAL_Z_INDEX);

    if (windowId) {
      const currentWindow = windows.find((win) => win.windowId === windowId);

      if (!currentWindow)
        return logger.error(`[FOCUS] Window ${windowId} is not found`);
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
    if (!appConfig || !app)
      return logger.error(`[MINIMIZE] App ${windowId} not found`);

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
    const filtered = currentWindows.filter((v) => v.windowId !== windowId);

    set({
      activeWindows: filtered,
    });
  },
}));
