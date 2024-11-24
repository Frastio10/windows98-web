import { unstable_batchedUpdates } from "react-dom";
import { MessageBoxProps } from "../components/Apps/MessageBox";
import { FileDialogProps } from "../components/Apps/FileDialog";
import { useWindow } from "../hooks/os";
import { AppName } from "../types";
import { BaseFileDialogOpts } from "../types/fileDialogs";

export default class System {
  private static _instance: System | null = null;

  public static getInstance() {
    if (!System._instance) {
      System._instance = new System();
    }
    return System._instance;
  }

  public static open(
    executable: AppName,
    initialData?: any,
    attachedTo?: string,
  ) {
    let result = null;
    unstable_batchedUpdates(() => {
      result = useWindow
        .getState()
        .openWindow(executable, initialData, attachedTo);
    });

    return result;
  }

  public static closeWindow(windowId: string) {
    let result = null;
    unstable_batchedUpdates(() => {
      result = useWindow.getState().closeWindowById(windowId);
    });

    return result;
  }

  public static messageBox(attachedTo?: string, initialData?: MessageBoxProps) {
    return System.open("messageBox", initialData, attachedTo);
  }

  public static saveFileDialog(
    attachedTo: string,
    initialData: BaseFileDialogOpts,
  ) {
    const saveFileDialogOpts = {
      initialPath: "C:/WINDOWS/Desktop",

      windowTitle: "Save As",

      actionLabel: "Save in",
      fileNameLabel: "File name",
      fileTypesLabel: "Save as type",

      ...initialData,
      isFileOnly: true,
      isMultiple: false, // disable multiple
      overwritePrompt: true,
      buttonConfirmLabel: "Save",
    } as FileDialogProps;

    return System.open("fileDialog", saveFileDialogOpts, attachedTo);
  }

  public static openFileDialog(
    attachedTo: string,
    initialData: BaseFileDialogOpts,
  ) {
    const saveFileDialogOpts = {
      initialPath: "C:/WINDOWS/Desktop",

      windowTitle: "Open",

      actionLabel: "Look in",
      fileNameLabel: "File name",
      fileTypesLabel: "Files of type",
      isMultiple: false, // on default
      notFoundPrompt: true,
      ...initialData,
      buttonConfirmLabel: "Open",
    } as FileDialogProps;

    return System.open("fileDialog", saveFileDialogOpts, attachedTo);
  }
}
