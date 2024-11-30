import { FilePath } from "../types";
import Disk from "./disk";
import { logger } from "./logger";

const FILE_ID_PREFIX = "file-";
export const STORAGE_KEY = "fs";

export const ROOT_FILENAME = "C:";

export const extractFileSystemToJson = () => {};

export class FileNode {
  name: string;
  isDirectory: boolean;
  children: FileNode[];
  content: any;
  id: string;
  icon: string | null;
  parent: FileNode | null;
  createdAt: Date;
  updatedAt: Date;
  path: FilePath;

  constructor(
    name: string,
    isDirectory = false,
    parent: FileNode | null,
    id?: string,
  ) {
    this.name = name;
    this.isDirectory = isDirectory;
    this.children = [];
    this.icon = null;
    this.content = null;

    const makeId = (len: number) => {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < len) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
        counter += 1;
      }
      return result;
    };

    this.id = id || `${FILE_ID_PREFIX}${makeId(5)}-${Date.now()}`;
    this.parent = parent;

    this.path = this.getNodePath();

    this.updatedAt = new Date();
    this.createdAt = new Date();
  }

  addChild(childNode: FileNode, updateDisk: boolean = true) {
    this.children.push(childNode);
    this.updateDate();
    if (updateDisk) this.updateDisk();
  }

  rename(newName: string, updateDisk: boolean = true) {
    this.name = newName;
    this.path = this.getNodePath();
    this.updateDate();
    if (updateDisk) this.updateDisk();

    return this.name;
  }

  updateDisk() {
    const fs = FileSystem.getInstance();
    fs.updateStorageData();
  }

  updateDate() {
    this.updatedAt = new Date();
    return this.updatedAt;
  }

  removeChild(childNode: FileNode, updateDisk = true) {
    this.children = this.children.filter((child) => child.id !== childNode.id);
    this.updateDate();

    if (updateDisk) this.updateDisk();
  }

  getNodePath() {
    const pathSegments = [];
    let currentNode: FileNode | null = this;

    while (currentNode) {
      pathSegments.unshift(currentNode.name);
      currentNode = currentNode.parent;
    }

    const nodePath = pathSegments.join("/");
    return nodePath === "" ? "/" : `${nodePath}`;
  }
}

export default class FileSystem {
  root: FileNode;
  private static _instance: FileSystem | null = null;

  constructor() {
    this.root = new FileNode(ROOT_FILENAME, true, null);
    logger.log("Created FileSystem instance.");
  }

  public static getInstance() {
    if (!FileSystem._instance) {
      FileSystem._instance = new FileSystem();
    }
    return FileSystem._instance;
  }

  public static makeId(len: number) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  static loadFilesFromArray(root: FileNode, fileArr: FileNode[]) {
    fileArr.forEach((file) => {
      const node = new FileNode(file.name, file.isDirectory, root, file.id);
      node.content = file.content;
      node.icon = file.icon;
      root.addChild(node);

      if (file.children && file.children.length)
        FileSystem.loadFilesFromArray(node, file.children);
    });

    logger.log(
      `${root.children.length} files/folders were initially loaded in folder '${root.name}'`,
    );
  }

  updateStorageData() {
    const jsonNode = FileSystem.extractNodeToJson(this.root);
    const disk = Disk.getInstance();

    disk.setJSON(STORAGE_KEY, jsonNode);
    logger.log("Saved to disk.");
  }

  static getSavedFiles() {
    const disk = Disk.getInstance();
    const local = disk.getJSON(STORAGE_KEY);
    if (!local) {
      return logger.log(
        "Saved data is not found. Loading from initial folders..",
      );
    }

    logger.log("Saved data is found. Loading from saved data..");
    return local;
  }

  static extractNodeToJson(node: FileNode) {
    const result: any = {
      name: node.name,
      isDirectory: node.isDirectory,
      content: node.content,
      id: node.id,
      icon: node.icon,
      children: [],
    };

    if (node.children.length > 0) {
      result.children = node.children.map((childNode) =>
        FileSystem.extractNodeToJson(childNode),
      );
    }

    return result;
  }

  removeNode(path: FilePath) {
    const target = this.getNodeByPath(path);

    if (!target)
      return logger.log(`Cannot remove file, file '${path}' is not found`);
    if (!target.parent)
      return logger.log(`Parent folder for file '${path}' is not found.`);

    target.parent.removeChild(target);
  }

  // case insensitive
  searchNodeByPath(path: FilePath) {
    const pathSegments = path.split("/").filter((segment) => segment); // Remove empty segments
    let currentNode = this.root;

    for (const segment of pathSegments) {
      if (segment.toLowerCase() === ROOT_FILENAME.toLowerCase()) continue;

      const foundNode = currentNode.children.find((node) =>
        node.name.toLowerCase().includes(segment.toLowerCase()),
      );

      if (!foundNode) {
        return null; // Node not found
      }
      if (!foundNode.isDirectory) {
        return foundNode;
      }
      currentNode = foundNode;
    }

    return currentNode;
  }

  searchNodes(path: FilePath) {
    const pathSegments = path.split("/");
    const nonEmptySegments = pathSegments.filter((segment) => segment);
    let results: FileNode[] = [];
    let currentNode = this.root;

    const lastSegment = pathSegments[pathSegments.length - 1];
    const lastNonEmptySegment = nonEmptySegments[nonEmptySegments.length - 1];
    const hasTrailingSlash = lastSegment === "";

    for (const [index, segment] of pathSegments.entries()) {
      const isLastSegment = index === pathSegments.length - 1;

      // Skip root directory filename matching if needed
      if (segment.toLowerCase() === ROOT_FILENAME.toLowerCase()) continue;

      // Find all nodes that match the current segment (case-insensitive)
      const matchingNodes = currentNode.children.filter((node) =>
        node.name.toLowerCase().includes(segment.toLowerCase()),
      );

      // Debug logging to inspect segment processing
      console.log({
        isLastSegment,
        lastSegment,
        hasTrailingSlash,
        lastNonEmptySegment,
        segment,
      });

      // Handle logic based on whether it's the last segment and if there's a trailing slash
      if (isLastSegment) {
        if (hasTrailingSlash) {
          if (
            lastNonEmptySegment.toLowerCase() === currentNode.name.toLowerCase()
          ) {
            results = currentNode.children; // Return all children if name matches
          } else {
            results = []; // No match if names don’t align
          }
        } else {
          results = currentNode.children.filter((node) =>
            node.name.toLowerCase().includes(lastSegment.toLowerCase()),
          );
        }
      }

      // Move to the next matching node if available
      if (matchingNodes.length > 0) {
        currentNode = matchingNodes[0];
      } else if (isLastSegment) {
        // Stop if no matching node is found on the last segment
        return results;
      }
    }

    return results;
  }

  getNodeByPath(path: FilePath) {
    const pathSegments = path.split("/").filter((segment) => segment); // Remove empty segments
    let currentNode = this.root;

    for (const segment of pathSegments) {
      if (segment === ROOT_FILENAME) continue;

      const foundNode = currentNode.children.find(
        (node) => node.name === segment,
      );

      if (!foundNode) {
        return null; // Node not found
      }
      if (!foundNode.isDirectory) {
        return foundNode;
      }
      currentNode = foundNode;
    }

    return currentNode;
  }

  getDesktopFiles() {
    const DESKTOP_PATH = "C:/WINDOWS/Desktop";
    const node = this.getNodeByPath(DESKTOP_PATH);
    if (!node) logger.error("Desktop not found... Weird.");

    return node;
  }

  getStoredSettings() {
    const SETTINGS_JSON = "C:/WINDOWS/settings.json";
    const node = this.getNodeByPath(SETTINGS_JSON);

    if (!node) return logger.error("Desktop not found... Weird.");

    return JSON.parse(node.content);
  }

  // @TODO
  updateStoredSettings(newData: any) {
    const SETTINGS_JSON = "C:/WINDOWS/settings.json";
    const node = this.getNodeByPath(SETTINGS_JSON);
    if (!node) return logger.error("Desktop not found... Weird.");

    node.content = JSON.stringify(newData);

    return this;
  }

  createFileNode(
    filename: string,
    isDirectory: boolean,
    parent: FileNode | null,
  ) {
    if (parent?.children?.find((f) => f.name.toLowerCase() === filename)) {
      throw new Error(`File ${filename} already exists`);
    }
    const file = new FileNode(filename, isDirectory, parent);
    if (parent) parent.addChild(file);

    return file;
  }

  writeFile(filepath: FilePath, content: any = "") {
    const pathSegments = filepath.split("/").filter((segment) => segment);
    const filename = pathSegments[pathSegments.length - 1];
    const parentPath = pathSegments.slice(0, -1).join("/");

    let currentNode = this.root;

    // Create or traverse to parent directories
    for (let i = 0; i < pathSegments.length - 1; i++) {
      const segment = pathSegments[i];
      if (segment.toLowerCase() === ROOT_FILENAME.toLowerCase()) continue;

      let childNode = currentNode.children.find(
        (node) => node.name.toLowerCase() === segment.toLowerCase(),
      );

      // Create directory if it doesn't exist
      if (!childNode) {
        childNode = this.createFileNode(segment, true, currentNode);
      } else if (!childNode.isDirectory) {
        throw new Error(`Cannot create directory '${segment}': File exists`);
      }

      currentNode = childNode;
    }

    let fileNode = currentNode.children.find(
      (node) => node.name.toLowerCase() === filename.toLowerCase(),
    );

    if (fileNode) {
      fileNode.content = content;
      fileNode.updateDate();
    } else {
      fileNode = this.createFileNode(filename, false, currentNode);
      fileNode.content = content;
    }

    this.updateStorageData();

    logger.log(`File '${filepath}' has been written successfully.`);
    return fileNode;
  }
}
