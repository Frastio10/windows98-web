import { AppName } from "../types";
import { generateRandomString, log } from "../utils";
import Disk from "./disk";

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
  path: string;

  constructor(name: string, isDirectory = false, parent: FileNode | null) {
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

    this.id = `${FILE_ID_PREFIX}${makeId(5)}-${Date.now()}`;
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
    this.path = this.getNodePath()
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
    this.children = this.children.filter((child) => child !== childNode);
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
    log("Created FileSystem instance.");
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

  static loadFilesFromArray(root: FileNode, fileArr: any[]) {
    fileArr.forEach((file: any) => {
      const node = new FileNode(file.name, file.isDirectory, root);
      node.content = file.content;
      node.icon = file.icon;
      root.addChild(node);

      if (file.children && file.children.length)
        FileSystem.loadFilesFromArray(node, file.children);
    });

    log(
      `${root.children.length} files/folders were initially loaded in folder '${root.name}'`,
    );
  }

  updateStorageData() {
    const jsonNode = FileSystem.extractNodeToJson(this.root);
    const disk = Disk.getInstance();

    disk.setJSON(STORAGE_KEY, jsonNode);
    log("Saved to disk.");
  }

  static getSavedFiles() {
    const disk = Disk.getInstance();
    const local = disk.getJSON(STORAGE_KEY);
    if (!local) {
      return log("Saved data is not found. Loading from initial folders..");
    }

    log("Saved data is found. Loading from saved data..");
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

  getNodeByPath(path: string) {
    const pathSegments = path.split("/");
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
    const DESKTOP_PATH = "C:/Desktop";
    const node = this.getNodeByPath(DESKTOP_PATH);
    if (!node) log("Desktop not found... Weird.");

    return node;
  }
}
