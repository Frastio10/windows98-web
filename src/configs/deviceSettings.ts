import { drivers } from "./drivers";

interface DeviceSettings {
  storage: keyof typeof drivers.storages;
  cacheStorage: keyof typeof drivers.cache;
  audio: keyof typeof drivers.audio;
}

export const deviceSettings: DeviceSettings = {
  storage: "indexedDBStorage",
  cacheStorage: "mapStorage",
  audio: "deviceAudio",
};
