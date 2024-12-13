import MapStorageDriver from "../libs/drivers/storages/MapStorage";
import LocalStorageDriver from "../libs/drivers/storages/LocalStorage";
import SessionStorageDriver from "../libs/drivers/storages/SessionStorage";

import DeviceAudioDriver from "../libs/drivers/audio/DeviceAudio";

export const drivers = {
  storages: {
    localStorage: LocalStorageDriver,
    sessionStorage: SessionStorageDriver,
    mapStorage: MapStorageDriver,
  },
  cache: {
    sessionStorage: SessionStorageDriver,
    mapStorage: MapStorageDriver,
  },
  audio: {
    deviceAudio: DeviceAudioDriver,
  },
};
