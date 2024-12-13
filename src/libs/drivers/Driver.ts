export default interface Driver {
  initialized: boolean;

  initialize(): void;
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
