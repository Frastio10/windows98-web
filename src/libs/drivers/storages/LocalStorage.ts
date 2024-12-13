import { logger } from "../../Logger";
import StorageDriver from "./Storage";
export default class LocalStorageDriver extends StorageDriver {
  private storage!: Storage | null;
  initialized: boolean = false;

  constructor() {
    super();
    // this.storage = window.localStorage;
  }

  initialize() {
    if (window && window.localStorage) {
      this.storage = window.localStorage;
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
      return logger.error("LocalStorageDriver is not initialized");
    }
    try {
      const value = this.storage.getItem(key);
      return value;
    } catch (error) {
      console.error("Error reading from local storage:", error);
      return null;
    }
  }

  write(key: string, value: any) {
    if (!this.storage)
      return logger.error("LocalStorageDriver is not initialized");
    try {
      // const serializedValue = JSON.stringify(value);
      this.storage.setItem(key, value);
    } catch (error) {
      // console.error("Error writing to local storage:", error);
      throw error;
    }
  }

  delete(key: string) {
    if (!this.storage)
      return logger.error("LocalStorageDriver is not initialized");
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error("Error deleting from local storage:", error);
    }
  }

  clear() {
    if (!this.storage)
      return logger.error("LocalStorageDriver is not initialized");
    try {
      this.storage.clear();
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  }
}
