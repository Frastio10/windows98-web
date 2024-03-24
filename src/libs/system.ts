import { useWindow } from "../hooks/os";
import { AppName } from "../types";

export default class System {
  private static _instance: System | null = null;

  public static getInstance() {
    if (!System._instance) {
      System._instance = new System();
    }
    return System._instance;
  }

  open(executable: AppName, initialData: any) {
    useWindow.getState().openWindow(executable, initialData);

    return 1;
  }
}
