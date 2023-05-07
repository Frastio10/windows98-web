import { create } from "zustand";

interface CounterState {
  counter: number;
  addCounter: () => void;
  addBy: (by: number) => void;
}

export const useCounter = create<CounterState>((set) => ({
  counter: 0,

  addCounter: () => set((state) => ({ counter: state.counter + 1 })),
  addBy: (by) => set((state) => ({ counter: state.counter + by })),
}));
