import { safeJsonParse } from "../utils";

export default class Disk {
  private static _instance: Disk | null = null;
  private storage: Storage;
  private cache: { [key: string]: any };

  private constructor() {
    this.storage = localStorage;
    this.cache = {};
  }

  setJSON(key: string, val: any) {
    const string = JSON.stringify(val);
    this.setCache(key, val);

    this.storage.setItem(key, string);
  }

  flush() {
    this.cache = {};
    this.storage.clear();
  }

  delete(key: string) {
    delete this.cache[key];
    this.storage.removeItem(key);
  }

  getJSON(key: string) {
    const cache = this.getCache(key);
    if (cache) return cache;

    return safeJsonParse(this.get(key));
  }

  getCache(key: string) {
    return this.cache[key];
  }

  get(key: string) {
    const cache = this.getCache(key);
    if (cache) return cache;

    return this.storage.getItem(key);
  }

  setCache(key: string, val: any) {
    this.cache[key] = val;
  }

  set(key: string, val: string) {
    this.setCache(key, val);
    return this.storage.setItem(key, val);
  }

  public static getInstance() {
    if (!Disk._instance) {
      Disk._instance = new Disk();
    }
    return Disk._instance;
  }

  // Other methods or properties related to Disk can be added here
}
