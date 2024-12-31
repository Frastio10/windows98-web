import { FILE_EXTENSION } from "../../configs/fileSystem";
import { FileHandler, FileMetadata, FileProcessor } from "../FileProcessor";
import { FileNode } from "../FileSystem";
import RegistryManager from "../RegistryManager";
import System from "../System";
import FileSystem from "../FileSystem";

export class DefaultFileHandler implements FileHandler {
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
    if (this.fileMetadata.executables && this.fileMetadata.executables.length) {
      System.open(this.fileMetadata?.executables[0], args || this.file.path);
    } else {
      FileProcessor.unsupportedModal();
    }
  }

  read() {
    this.fileMetadata.executables = this.findSupportedApps();
    return this;
  }

  private findSupportedApps() {
    const ext = this.fileMetadata.extension?.toLowerCase();
    if (!ext) return [];

    const registry = RegistryManager.getRegistryValue("SOFTWARE");
    const fileTypeInfo = registry.fileTypes[ext];

    const defaultAppPath = fileTypeInfo?.defaultApp?.path;
    if (!defaultAppPath) return [];

    const executableFile =
      FileSystem.getInstance().getNodeByPath(defaultAppPath);
    if (!executableFile) return [];

    const fp = new FileProcessor(executableFile);
    fp.read();
    return fp.fileMetadata.executables || [];
  }
}
