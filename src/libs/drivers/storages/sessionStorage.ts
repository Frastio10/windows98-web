import { logger } from "../../Logger";
import StorageDriver from "./Storage";
export default class SessionStorageDriver extends StorageDriver {
  private storage!: Storage | null;
  initialized: boolean = false;

  constructor() {
    super();
    // this.storage = window.sessionStorage;
  }

  initialize() {
    if (window && window.localStorage) {
      this.storage = window.sessionStorage;
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

  readJSON(key: string) {
    if (!this.storage) {
      return logger.error("LocalStorageDriver is not initialized");
    }
    try {
      const value = this.storage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error("Error reading from local storage:", error);
      return null;
    }
  }

  read(key: string) {
    if (!this.storage) {
      return logger.error("LocalStorageDriver is not initialized");
    }
    try {
      const value = this.storage.getItem(key);
      return value;
    } catch (error) {
      logger.error("Error reading from local storage:", error);
      return null;
    }
  }

  write(key: string, value: any) {
    if (!this.storage) {
      return logger.error("LocalStorageDriver is not initialized");
    }
    try {
      // const serializedValue = JSON.stringify(value);
      this.storage.setItem(key, value);
    } catch (error) {
      logger.error("Error writing to local storage:", error);
    }
  }

  delete(key: string) {
    if (!this.storage) {
      return logger.error("LocalStorageDriver is not initialized");
    }
    try {
      this.storage.removeItem(key);
    } catch (error) {
      logger.error("Error deleting from local storage:", error);
    }
  }

  clear() {
    if (!this.storage) {
      return logger.error("LocalStorageDriver is not initialized");
    }

    try {
      this.storage.clear();
    } catch (error) {
      logger.error("Error clearing local storage:", error);
    }
  }
}
