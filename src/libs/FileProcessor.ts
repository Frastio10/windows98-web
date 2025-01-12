import { EXTENSION_READERS } from "../configs/constants";
import { FILE_EXTENSION } from "../configs/fileSystem";
import { AppName } from "../types";
import { log } from "../utils";
import { FileNode } from "./FileSystem";
import System from "./System";

import { ExeFileHandler } from "./runners/ExeRunner";
import { LnkFileHandler } from "./runners/LnkRunner";
import { DefaultFileHandler } from "./runners/DefaultRunner";

// the name FileReader is reserved :(
export type FileMetadata = {
  extension: string | null;
  executables?: AppName[];
  name: string | null;
};

export type FileNameOptions = {
  showAllExtensions?: boolean; // Show the full filename, including all extensions
  hideAllExtensions?: boolean; // Hide all extensions
  excludeExtensions?: string[]; // Exclude only specific extensions
};

export interface FileHandler {
  file: FileNode;
  fileMetadata: FileMetadata;
  read(): FileHandler;
  run(args?: any): void;
}

export class FileProcessor {
  file: FileNode;
  fileMetadata: FileMetadata;
  handler: FileHandler;

  constructor(file: FileNode) {
    this.file = file;
    this.fileMetadata = {
      extension: FileProcessor.getFileExtension(this.file.name),
      name: FileProcessor.getFileNameOnly(this.file.name),
    };
    this.handler = this.getHandler()!;
  }

  private getHandler() {
    switch (this.fileMetadata.extension) {
      case FILE_EXTENSION.EXE:
        return new ExeFileHandler(this.file);

      case FILE_EXTENSION.LNK:
        return new LnkFileHandler(this.file);

      default:
        return new DefaultFileHandler(this.file);
    }
  }

  read() {
    const handler = this.handler;
    if (handler) {
      const data = handler.read();
      this.fileMetadata = data.fileMetadata;
      return data;
    }
  }

  run(args?: any) {
    const handler = this.handler;
    if (handler) {
      return handler.run(args);
    } else {
      log("No supported programs.");
    }
  }

  static unsupportedModal() {
    System.messageBox(undefined, {
      title: "Error!",
      description: "There is no app that support this file extension.",
      height: 120,
      cb: (r) => {
        System.closeWindow(r.windowData.windowId);
      },
    });
    return;
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

  static getFileName(fileName: string, options?: FileNameOptions): string {
    const parts = fileName.split(".");

    if (parts.length <= 1) {
      return fileName;
    }

    const baseName = parts.slice(0, -1).join(".");
    const allExtensions = parts.slice(1);

    if (options?.showAllExtensions) {
      return fileName;
    }

    if (options?.hideAllExtensions) {
      return baseName;
    }

    if (options?.excludeExtensions) {
      const filteredExtensions = allExtensions.filter(
        (ext) => !options.excludeExtensions?.includes(ext),
      );

      if (filteredExtensions.length === 0) {
        return baseName;
      }

      return `${baseName}.${filteredExtensions.join(".")}`;
    }

    return baseName;
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
