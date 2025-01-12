import { unstable_batchedUpdates } from "react-dom";
import { MessageBoxProps } from "../components/Apps/MessageBox";
import { FileDialogProps } from "../components/Apps/FileDialog";
import { useWindow } from "../hooks/os";
import { AppName } from "../types";
import { BaseFileDialogOpts } from "../types/fileDialogs";
import DriverManager from "./DriverManager";
import { drivers } from "../configs/drivers";
import { deviceSettings } from "../configs/deviceSettings";
import StorageDriver from "./drivers/storages/Storage";
import { logger } from "./Logger";
import DeviceAudioDriver from "./drivers/audio/DeviceAudio";
import { FileProcessor } from "./FileProcessor";
import FileSystem from "./FileSystem";
import { getFileExtension } from "../utils";
import { FILE_EXTENSION } from "../configs/fileSystem";

export default class System {
  private static _instance: System | null = null;
  private driverManager!: DriverManager;

  public static getInstance() {
    if (!System._instance) {
      System._instance = new System();
    }
    return System._instance;
  }

  private async loadDriverModule(module: keyof typeof drivers) {
    const moduleDrivers = drivers[module];
    const driverArr = Object.entries(moduleDrivers);
    for (let [key, driver] of driverArr) {
      await this.driverManager.load(new driver(), key);
    }
    // driverArr.forEach(([key, value]) => {
    //     this.driverManager.load(new value(), key);
    //  });
    logger.log(`${driverArr.length} of ${module} drivers are loaded.`);
  }

  async loadDrivers() {
    this.driverManager = new DriverManager();
    await this.loadDriverModule("storages");
    await this.loadDriverModule("cache");
    await this.loadDriverModule("audio");
  }

  storage() {
    const storage = deviceSettings.storage;
    return this.driverManager.getDriver(storage) as StorageDriver;
  }

  audio() {
    const storage = deviceSettings.audio;
    const audioDriver = this.driverManager.getDriver(
      storage,
    ) as DeviceAudioDriver;

    return audioDriver;
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

  public static exec(path: string, args?: any) {
    const fs = FileSystem.getInstance();
    const file = fs.getNodeByPath(path);
    if (!file) {
      throw new Error(`Path '${path}' is invalid`);
    }

    if (getFileExtension(file.name) !== FILE_EXTENSION.EXE) {
      throw new Error(`'${path}' is not an executable.`);
    }

    logger.log(`Executing ${file.path}...`);
    const fileProcessor = new FileProcessor(file);
    fileProcessor.read();
    fileProcessor.run(args);
  }
}
