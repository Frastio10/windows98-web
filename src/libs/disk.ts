import { log, safeJsonParse } from "../utils";

// @ts-ignore
const lzmaWorker = LZMA as any;

export default class Disk {
  private static _instance: Disk | null = null;
  private storage: Storage;
  private cache: { [key: string]: any };
  private useLZMA: boolean;

  private lzmaWorker: any;

  private constructor() {
    this.storage = localStorage;
    this.cache = {};
    this.useLZMA = true;

    if (this.useLZMA && lzmaWorker) {
      this.lzmaWorker = lzmaWorker;
    }

    // @ts-ignore
    // this.workerLZMA=
    // console.log(LZMA)
  }

  decompressLZMA(data: string) {
    if (!this.lzmaWorker) return log(`LZMA worker is not found.`);
    return this.lzmaWorker.decompress(data);
  }

  compressLZMA(data: string) {
    if (!this.lzmaWorker) return log(`LZMA worker is not found.`);
    return this.lzmaWorker.compress(data, 1);
  }

  setStorage(storage: Storage) {
    this.storage = storage;
    return this.storage;
  }

  setJSON(key: string, val: any) {
    this.setCache(key, val);

    const string = JSON.stringify(val);
    const compressed = this.compressLZMA(string);

    if (this.useLZMA) return this.storage.setItem(key, compressed);

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

    const savedData = this.get(key);
    if (!savedData) return null;

    const decompressed = this.decompressLZMA(savedData.split(","));

    return safeJsonParse(decompressed);
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
