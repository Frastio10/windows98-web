export default interface Driver {
  initialized: boolean;

  initialize(): Promise<void> | void;
  terminate(): void;
  getStatus(): string;
}

// export default abstract class Driver implements DriverInterface {
//   initialize() {}
//   terminate() {}
//   getStatus() {
//     return null
//   }
// }
