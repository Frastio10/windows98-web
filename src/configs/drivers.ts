import MapStorageDriver from "../libs/drivers/storages/mapStorage";
import LocalStorageDriver from "../libs/drivers/storages/localStorage";
import SessionStorageDriver from "../libs/drivers/storages/sessionStorage";

import DeviceAudioDriver from "../libs/drivers/audio/deviceAudio";

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
