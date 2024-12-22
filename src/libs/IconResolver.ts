import { FILE_EXTENSION } from "../configs/fileSystem";
import { getFileExtension, iconSize } from "../utils";
import { FileNode } from "./FileSystem";
import RegistryManager from "./RegistryManager";
import FileSystem from "./FileSystem";

export default class IconResolver {
  static getIconSrc(key: string) {
    return {
      small: iconSize(key, "small"),
      medium: iconSize(key, "medium"),
      big: iconSize(key, "big"),
    };
  }
  static resolve(file: FileNode) {
    const fs = FileSystem.getInstance();
    const softwareRegistry = JSON.parse(
      RegistryManager.getRegistry("SOFTWARE").content,
    );

    const fileExtension = getFileExtension(file.name);
    const fileTypes = softwareRegistry.fileTypes;
    const extensionIconData = fileTypes[fileExtension!];

    let iconKey = extensionIconData?.defaultIcon?.source;
    if (fileExtension === FILE_EXTENSION.EXE) {
      if (file.content?.icon) {
        iconKey = file.content.icon;
      }
    }

    if (fileExtension === FILE_EXTENSION.LNK) {
      const targetFile = fs.getNodeByPath(file.content?.target?.path);

      if (targetFile) {
        iconKey = targetFile.content.icon;
      }

      if (!targetFile) iconKey = "notepad";

      if (!file.content?.icon?.key) {
        file.content.icon.key = iconKey;
        fs.updateStorageData();
      }
    }

    if (file.isDirectory) {
      const systemFolders = softwareRegistry.systemFolders;
      const folderIconData = systemFolders[file.name];

      if (folderIconData && file.path === folderIconData.path) {
        iconKey = folderIconData.defaultIcon.source;
      } else {
        iconKey = "directory_closed";
      }
    }

    if (!iconKey) iconKey = "file_windows";

    return IconResolver.getIconSrc(iconKey);
  }

  static isSpecialFolder(file: FileNode) {
    const softwareRegistry = JSON.parse(
      RegistryManager.getRegistry("SOFTWARE").content,
    );

    if (file.isDirectory) {
      const systemFolders = softwareRegistry.systemFolders;
      const folderIconData = systemFolders[file.name];

      if (folderIconData && file.path === folderIconData.path) {
        return true;
      }

      return false;
    }

    return false;
  }
}
