import { getFileExtension, iconSize } from "../utils";
import { FileNode } from "./fileSystem";
import RegistryManager from "./registryManager";

export default class IconResolver {
  static resolve(file: FileNode) {
    const softwareRegistry = RegistryManager.getRegistry("SOFTWARE").content;

    const fileExtension = "." + getFileExtension(file.name);
    const fileTypes = softwareRegistry.fileTypes;
    const extensionIconData = fileTypes[fileExtension];

    console.log(extensionIconData);

    return {
      small: iconSize(extensionIconData.defaultIcon.source, "small"),
      medium: iconSize(extensionIconData.defaultIcon.source, "medium"),
      big: iconSize(extensionIconData.defaultIcon.source, "big"),
    };
  }
}
