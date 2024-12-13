import { create } from "zustand";

interface StartMenuState {
  isStartMenuOpen: boolean;
  isStartButtonClicked: boolean;

  changeStartMenu: (state?: boolean) => void;
  changeStartMenuButton: (state?: boolean) => void;
}

export const useStartMenu = create<StartMenuState>((set, get) => ({
  isStartMenuOpen: false,
  isStartButtonClicked: false,

  changeStartMenu: (isActive) => {
    set({ isStartMenuOpen: isActive || !get().isStartMenuOpen })
  },
  changeStartMenuButton: (isActive) => {
    set({ isStartButtonClicked: isActive || !get().isStartButtonClicked })
  },
}))
