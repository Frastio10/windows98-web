import { create } from "zustand";

interface AuthState {
  currentPassword: string;
  isLoggedIn: boolean;

  isLoginError: boolean;
  login: () => void;
  logOut: () => void;
  updatePassword: (password: string) => void;
}

export const useAuth = create<AuthState>((set) => ({
  currentPassword: "Helloworld69",
  isLoggedIn: localStorage.getItem("loggedIn") === "1" || false,
  isLoginError: false,

  updatePassword: (password) => set(() => ({ currentPassword: password })),
  login: () => {
    set((state) => ({
      isLoginError: state.currentPassword.length ? false : true,
      isLoggedIn: state.currentPassword.length ? true : false,
    }));

    localStorage.setItem("loggedIn", "1");
  },

  logOut: () => {
    localStorage.setItem("loggedIn", "0");
    set((state) => ({
      isLoggedIn: false,
    }));
  },
}));
