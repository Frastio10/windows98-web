import StorageDriver from "./storage";

export default class MapStorageDriver extends StorageDriver {
  private storage: Map<string, any>;

  constructor() {
    super();
    this.storage = new Map();
  }

  read(key: string) {
    const val = this.storage.get(key);
    if (!val) return null;
    else return val;
  }

  clear() {
    return this.storage.clear();
  }

  delete(key: string) {
    return this.storage.delete(key);
  }

  write(key: string, value: any) {
    return this.storage.set(key, value);
  }
}
