import StorageDriver from "./storage";
export default class SessionStorageDriver extends StorageDriver {
  private storage: Storage;

  constructor() {
    super();
    this.storage = window.sessionStorage;
  }

  readJSON(key: string) {
    try {
      const value = this.storage.getItem(key);
      console.log(value);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error reading from local storage:", error);
      return null;
    }
  }

  read(key: string) {
    try {
      const value = this.storage.getItem(key);
      return value;
    } catch (error) {
      console.error("Error reading from local storage:", error);
      return null;
    }
  }

  write(key: string, value: any) {
    try {
      // const serializedValue = JSON.stringify(value);
      this.storage.setItem(key, value);
    } catch (error) {
      console.error("Error writing to local storage:", error);
    }
  }

  delete(key: string) {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error("Error deleting from local storage:", error);
    }
  }

  clear() {
    try {
      this.storage.clear();
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  }
}
