import { FileHandler, FileMetadata, FileProcessor } from "../FileProcessor";
import { FileNode } from "../FileSystem";
import System from "../System";
import FileSystem from "../FileSystem";

export class LnkFileHandler implements FileHandler {
  file: FileNode;
  fileMetadata: FileMetadata;

  constructor(file: FileNode) {
    this.file = file;
    this.fileMetadata = {
      extension: FileProcessor.getFileExtension(file.name),
      name: FileProcessor.getFileNameOnly(file.name),
      executables: [],
    };
  }

  run(args?: any) {
    const path = this.file.content.target.path;
    if (path.includes("http")) {
      return window.open(path, "_blank");
    }

    if (!this.fileMetadata.executables?.length) {
      FileProcessor.unsupportedModal();
      return;
    }

    System.open(this.fileMetadata?.executables[0], args);
  }

  read() {
    this.fileMetadata.executables = this.findSupportedApps();

    return this;
  }

  private findSupportedApps() {
    const lnkFile = FileSystem.getInstance().getNodeByPath(
      this.file.content.target.path,
    );
    if (!lnkFile) return [];

    const fp = new FileProcessor(lnkFile);
    fp.read();

    return fp.fileMetadata.executables || [];
  }
}
