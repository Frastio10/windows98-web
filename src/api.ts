import { useWindow } from "./hooks/os";

const os = () => {
  // window: !!typeof window ? useWindow.getState() : null,

  return {
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    cookie: document.cookie,
    clipboard: navigator.clipboard,
    internalClipboard: navigator.clipboard,
  };
};

export default os();
