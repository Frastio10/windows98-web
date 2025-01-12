import { logger } from "../../Logger";
import StorageDriver from "./Storage";

export default class IndexedDBDriver extends StorageDriver {
  private db!: IDBDatabase | null;
  initialized: boolean = false;
  private readonly dbName: string;
  private readonly storeName: string;

  constructor(dbName: string = "AppDB", storeName: string = "KeyValueStore") {
    super();
    this.dbName = dbName;
    this.storeName = storeName;
  }

  initialize() {
    return new Promise<void>((resolve, reject) => {
      if (!window.indexedDB) {
        logger.error("IndexedDB is not supported in this browser");
        return reject("IndexedDB is not supported in this browser");
      }

      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "key" });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initialized = true;
        resolve();
      };

      request.onerror = () => {
        logger.error("Failed to initialize IndexedDB", request.error);
        reject(request.error);
      };
    });
  }

  terminate() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }

  getStatus() {
    return this.db ? "ok" : "not ok";
  }

  read(key: string) {
    return new Promise<any>((resolve, reject) => {
      if (!this.db) {
        logger.error("IndexedDBDriver is not initialized");
        return reject("IndexedDBDriver is not initialized");
      }

      const transaction = this.db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      console.time("START");
      request.onsuccess = () => {
        console.timeEnd("START");
        resolve(request.result?.value ?? null);
      };

      request.onerror = () => {
        logger.error("Error reading from IndexedDB", request.error);
        reject(request.error);
      };
    });
  }

  async write(key: string, value: any) {
    return new Promise<void>((resolve, reject) => {
      console.time("Write");
      if (!this.db) {
        logger.error("IndexedDBDriver is not initialized");
        return reject("IndexedDBDriver is not initialized");
      }

      const transaction = this.db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ key, value });

      request.onsuccess = () => {
        resolve();
        console.timeEnd("Write");
      };

      request.onerror = () => {
        logger.error("Error writing to IndexedDB", request.error);
        reject(request.error);
      };
    });
  }

  delete(key: string) {
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        logger.error("IndexedDBDriver is not initialized");
        return reject("IndexedDBDriver is not initialized");
      }

      const transaction = this.db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        logger.error("Error deleting from IndexedDB", request.error);
        reject(request.error);
      };
    });
  }

  clear() {
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        logger.error("IndexedDBDriver is not initialized");
        return reject("IndexedDBDriver is not initialized");
      }

      const transaction = this.db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        logger.error("Error clearing IndexedDB", request.error);
        reject(request.error);
      };
    });
  }
}
