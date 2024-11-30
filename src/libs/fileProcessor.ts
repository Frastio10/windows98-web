import { EXTENSION_READERS } from "../configs/constants";
import { FILE_EXTENSIONS } from "../configs/fileSystem";
import { App, AppName } from "../types";
import { log } from "../utils";
import { FileNode } from "./fileSystem";
import System from "./system";

// the name FileReader is reserved :(
type FileMetadata = {
  extension: string | null;
  supportedPrograms?: AppName[];
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

  run() {
    if (!this.fileMetadata.supportedPrograms) {
      return log("No supported programs.");
    }

    if (this.fileMetadata.extension == FILE_EXTENSIONS.EXE) {
      return this.runExe();
    }

    System.open(this.fileMetadata?.supportedPrograms[0], this.file.path);

    return this;
  }

  read() {
    this.fileMetadata.supportedPrograms = this.findSupportedApps();

    if (this.fileMetadata.extension === "exe") {
      const exeData = this.readExe(this.file.content);
      this.fileMetadata.supportedPrograms = [exeData.appName as AppName];
    }
    return this;
  }

  private findSupportedApps() {
    const extensions = EXTENSION_READERS as any;

    const ext = this.fileMetadata.extension?.toLowerCase();
    if (!ext) return ["notepad"];

    const programs = extensions[ext].split(" ");

    return programs;
  }

  private readExe(str: string) {
    const split = str.split(" ");
    const command = split[0];
    const appName = split[1];

    return {
      command,
      appName,
    };
  }

  runExe() {
    System.open(this.fileMetadata.supportedPrograms![0], null);
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
