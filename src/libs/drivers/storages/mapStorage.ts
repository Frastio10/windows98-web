import { logger } from "../../Logger";
import StorageDriver from "./Storage";

export default class MapStorageDriver extends StorageDriver {
  private storage!: Map<string, any> | null;
  initialized: boolean = false;

  constructor() {
    super();
    // this.storage = new Map();
  }

  initialize() {
    if (window && window.localStorage) {
      this.storage = new Map();
      this.initialized = true;
    }
  }

  terminate() {
    this.storage = null;
    this.initialized = false;
  }

  getStatus() {
    if (this.storage) return "ok";
    else return "not ok";
  }

  read(key: string) {
    if (!this.storage) {
      return logger.error("MapStorageDriver is not initialized");
    }

    const val = this.storage.get(key);
    if (!val) return null;
    else return val;
  }

  clear() {
    if (!this.storage) {
      return logger.error("MapStorageDriver is not initialized");
    }
    return this.storage.clear();
  }

  delete(key: string) {
    if (!this.storage) {
      return logger.error("MapStorageDriver is not initialized");
    }
    return this.storage.delete(key);
  }

  write(key: string, value: any) {
    if (!this.storage) {
      return logger.error("MapStorageDriver is not initialized");
    }
    return this.storage.set(key, value);
  }
}
