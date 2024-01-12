import { create } from "zustand";

enum BootState {
  SHUTDOWN,
  ON,
  LOCKED,
}

interface SystemState {
  isMuted: boolean;
  isShutDown: boolean;
  isSystemLoading: boolean;

  setSystemLoading: (isLoading?: boolean) => void;
  changeMute: (isMuted?: boolean) => void;
  shutDown: () => void;
  turnOn: () => void;
}

export const useSystemState = create<SystemState>((set, get) => ({
  isMuted: false,
  isShutDown: false,
  isSystemLoading: false,

  setSystemLoading: (isLoading = true) => {
    set({
      isSystemLoading: isLoading,
    });
  },

  changeMute: (isMuted) => {
    set({ isMuted: isMuted || !get().isMuted });
  },

  shutDown: () => {
    set({ isShutDown: true });
  },

  turnOn: () => {
    set({ isShutDown: false });
  },
}));
