import { log, safeJsonParse } from "../utils";
import LZString from "lz-string";
import { deviceSettings } from "../configs/deviceSettings";
import { drivers } from "../configs/drivers";
import StorageDriver from "./drivers/storages/Storage";
import System from "./System";

type DiskOptions = {
  compressString: boolean;
};

export default class Disk {
  private static _instance: Disk | null = null;
  private storage: StorageDriver;
  private cache: { [key: string]: any };
  private opts: DiskOptions;

  private constructor(storage: StorageDriver, opts?: DiskOptions) {
    this.storage = storage;
    this.cache = {};

    this.opts = {
      // @ts-ignore i know what i am doing typescript.
      compressString: false,
      ...opts,
    };
  }

  private decompressLZMA(data: string) {
    return LZString.decompressFromUTF16(data);
  }

  private compressLZMA(data: string) {
    return LZString.compressToUTF16(data);
  }

  setStorage(storage: StorageDriver) {
    this.storage = storage;
    return this.storage;
  }

  setJSON(key: string, val: any) {
    try {
      this.setCache(key, val);

      const string = JSON.stringify(val);

      if (this.opts.compressString) {
        const compressed = this.compressLZMA(string);
        return this.storage.write(key, compressed);
      }

      this.storage.write(key, string);
    } catch (error) {
      throw error;
    }
  }

  flush() {
    this.cache = {};
    this.storage.clear();
  }

  delete(key: string) {
    delete this.cache[key];
    this.storage.delete(key);
  }

  getJSON(key: string) {
    const cache = this.getCache(key);
    if (cache) return cache;

    let savedData = this.get(key);
    if (!savedData) return null;

    if (this.opts.compressString) {
      savedData = this.decompressLZMA(savedData);
    }

    return safeJsonParse(savedData);
  }

  getCache(key: string) {
    return this.cache[key];
  }

  get(key: string) {
    const cache = this.getCache(key);
    if (cache) return cache;

    return this.storage.read(key);
  }

  setCache(key: string, val: any) {
    this.cache[key] = val;
  }

  set(key: string, val: string) {
    this.setCache(key, val);
    return this.storage.write(key, val);
  }

  public static getInstance(
    storage: StorageDriver = System.getInstance().storage(),
    opts?: DiskOptions,
  ) {
    if (!Disk._instance) {
      Disk._instance = new Disk(storage, opts);
    }
    return Disk._instance;
  }
}
