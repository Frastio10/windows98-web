import FileSystem from "./fileSystem";

export default class RegistryManager {
  static getRegistry(registry: "SYSTEM" | "SAM" | "SECURITY" | "SOFTWARE") {
    const fs = FileSystem.getInstance();
    const hivePath = "C:/WINDOWS/System32/config/";
    return fs.getNodeByPath(`${hivePath}${registry}`)!;
  }
}
