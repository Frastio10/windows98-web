interface DeviceSettings {
  storage: "localStorage" | "mapStorage" | "sessionStorage";
  cacheStorage: "mapStorage"| "sessionStorage"
}

export const deviceSettings: DeviceSettings = {
  storage: "localStorage",
  cacheStorage: "mapStorage",
};
