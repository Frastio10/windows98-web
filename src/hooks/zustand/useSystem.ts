import { create } from "zustand";
import System from "../../libs/System";

export enum BootState {
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

export const useSystem = create<SystemState>((set, get) => ({
  isMuted: false,
  isShutDown: false,
  isSystemLoading: false,

  setSystemLoading: (isLoading = true) => {
    set({
      isSystemLoading: isLoading,
    });
  },

  changeMute: (isMuted) => {
    const muted = isMuted || !get().isMuted;
    set({ isMuted: muted });

    System.getInstance()
      .audio()
      .setVolume(muted ? 0 : 1);
  },

  shutDown: () => {
    set({ isShutDown: true });
  },

  turnOn: () => {
    set({ isShutDown: false });
  },
}));
