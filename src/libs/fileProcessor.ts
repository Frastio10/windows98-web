import { EXTENSION_READERS } from "../configs/constants";
import { FILE_EXTENSION } from "../configs/fileSystem";
import { App, AppName } from "../types";
import { log, NOOP } from "../utils";
import { FileNode } from "./fileSystem";
import RegistryManager from "./registryManager";
import System from "./system";
import FileSystem from "./fileSystem";
import { logger } from "./logger";

// the name FileReader is reserved :(
type FileMetadata = {
  extension: string | null;
  executables?: AppName[];
  name: string | null;
};
export class FileProcessor {
  file: FileNode;
  fileMetadata: FileMetadata;

  constructor(file: FileNode) {
    this.file = file;
    this.fileMetadata = {
      extension: FileProcessor.getFileExtension(this.file.name),
      name: FileProcessor.getFileNameOnly(this.file.name),
    };
  }

  run(args?: any) {
    if (!this.fileMetadata.executables) {
      return log("No supported programs.");
    }

    if (this.fileMetadata.extension == FILE_EXTENSION.EXE) {
      return this.runExe(args);
    }

    if (this.fileMetadata.extension === FILE_EXTENSION.LNK) {
      System.open(this.fileMetadata?.executables[0], args);
      return this;
    }

    System.open(this.fileMetadata?.executables[0], args || this.file.path);

    return this;
  }

  read() {
    this.fileMetadata.executables = this.findSupportedApps() as AppName[];

    if (this.fileMetadata.extension === "exe") {
      const exeData = this.readExe(this.file.content);
      this.fileMetadata.executables = [exeData.appName as AppName];
    }
    return this;
  }

  private findSupportedApps() {
    const ext = this.fileMetadata.extension?.toLowerCase();
    if (!ext) return ["notepad"];
    if (ext === FILE_EXTENSION.EXE) return [];
    if (ext == FILE_EXTENSION.LNK) {
      const lnkFile = FileSystem.getInstance().getNodeByPath(
        this.file.content.target.path,
      );

      if (!lnkFile) {
        return [];
      }

      const fp = new FileProcessor(lnkFile);
      const fileData = fp.read();
      const exe = fileData.fileMetadata.executables;
      return exe || [];
    }

    const registry = RegistryManager.getRegistryValue("SOFTWARE");

    const fileTypeInfo = registry.fileTypes[ext];
    const defaultAppPath = fileTypeInfo.defaultApp.path;

    const executableFile =
      FileSystem.getInstance().getNodeByPath(defaultAppPath);

    if (!executableFile) {
      logger.error("Error");
      return [];
    }

    const fp = new FileProcessor(executableFile);
    const fileData = fp.read();
    const exe = fileData.fileMetadata.executables;

    return exe || [];
  }

  private readExe(content: any) {
    const appName = content.exe;

    return {
      appName,
    };
  }

  runExe(args?: any) {
    System.open(this.fileMetadata.executables![0], args || null);
  }

  static getFileExtension(fileName: string) {
    const parts = fileName.split(".");

    if (parts.length > 1) {
      return parts[parts.length - 1];
    }

    return null;
  }

  static getFileNameOnly(fileName: string) {
    const parts = fileName.split(".");

    if (parts.length > 1) {
      return parts.slice(0, -1).join(".");
    } else {
      return fileName;
    }
  }

  static getFileNameWIthSupportedExtensions(str: string) {
    const supportedExtensions = Object.keys(EXTENSION_READERS);
    const lowerCaseString = str.toLowerCase();

    for (const ext of supportedExtensions) {
      const lowerCaseExt = `.${ext.toLowerCase()}`;

      if (lowerCaseString.endsWith(lowerCaseExt)) {
        return str.slice(0, -ext.length - 1); // Remove the extension and the dot
      }
    }
  }
}
