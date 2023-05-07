import { create } from "zustand"

interface SystemState {
  isMuted: boolean;
  changeMute: (isMuted?: boolean) => void;
}

export const useSystemState = create<SystemState>((set, get) => ({
  isMuted: false,

  changeMute: (isMuted) => {
    set({ isMuted: isMuted || !get().isMuted })
  }
}))

