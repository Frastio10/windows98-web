import { useWindow } from "./hooks/os";

const os = {
  ...useWindow.getState(),
};

export default {
  os,
};
