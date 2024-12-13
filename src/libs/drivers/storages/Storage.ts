import Driver from "../Driver";

export default abstract class StorageDriver implements Driver {
  abstract initialized: boolean;

  abstract initialize(): void;
  abstract terminate(): void;
  abstract getStatus(): string;

  abstract read(key: string): any | null;
  abstract write(key: string, value: any): void;
  abstract delete(key: string): void;
  abstract clear(): void;
}
