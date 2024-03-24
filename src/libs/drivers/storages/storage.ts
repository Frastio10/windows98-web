import Driver from "../driver";

export default abstract class StorageDriver extends Driver {
  abstract read(key: string): any | null;
  abstract write(key: string, value: any): void;
  abstract delete(key: string): void;
  abstract clear(): void;
}
