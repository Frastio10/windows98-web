import FileSystem from "./FileSystem";
type RegistryModule = "SYSTEM" | "SAM" | "SECURITY" | "SOFTWARE" | "USER";
export default class RegistryManager {
  static getRegistry(registry: RegistryModule) {
    const fs = FileSystem.getInstance();
    const hivePath = "C:/WINDOWS/System32/config/";
    return fs.getNodeByPath(`${hivePath}${registry}`)!;
  }

  static getRegistryValue(registry: RegistryModule) {
    const file = RegistryManager.getRegistry(registry);
    if (typeof file.content === "string") return JSON.parse(file.content);
    return file.content;
  }

  static getEnv(key: string) {
    const envFile = RegistryManager.getRegistry("USER");
    const parsedEnv = JSON.parse(envFile.content);
    const value = parsedEnv.environment[key];
    return value;
  }
}
