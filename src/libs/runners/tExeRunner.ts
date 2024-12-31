import { AppName } from "../../types";
import { FileHandler, FileMetadata, FileProcessor } from "../FileProcessor";
import { FileNode } from "../FileSystem";
import System from "../System";

export class ExeFileHandler implements FileHandler {
  file: FileNode;
  fileMetadata: FileMetadata;

  constructor(file: FileNode) {
    this.file = file;
    this.fileMetadata = {
      extension: FileProcessor.getFileExtension(file.name),
      name: FileProcessor.getFileNameOnly(file.name),
    };
  }

  run(args?: any) {
    System.open(this.fileMetadata.executables![0], args || null);
  }

  read() {
    // this.fileMetadata.executables = this.findSupportedApps();
    const exeData = { appName: this.file.content.exe };
    this.fileMetadata.executables = [exeData.appName as AppName];

    return this;
  }

  private readExe(content: any) {
    const appName = content.exe;
    return { appName };
  }
}
