import MapStorageDriver from "../libs/drivers/storages/mapStorage";
import LocalStorageDriver from "../libs/drivers/storages/localStorage";
import SessionStorageDriver from "../libs/drivers/storages/sessionStorage";

export const drivers = {
  storages: {
    localStorage: LocalStorageDriver,
    sessionStorage: SessionStorageDriver,
    mapStorage: MapStorageDriver,
  },
};
