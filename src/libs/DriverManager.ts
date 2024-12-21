import Driver from "./drivers/Driver";
import { logger } from "./Logger";

export default class DriverManager {
  private drivers: Map<string, Driver> = new Map();

  async load(driver: Driver, driverName: string) {
    if (this.drivers.has(driverName)) {
      logger.log(`${driverName} is already loaded.`);
      return;
    }
    this.drivers.set(driverName, driver);
    await driver.initialize();
    logger.log(`${driverName} loaded.`);
  }

  unload(driverName: string): void {
    const driver = this.drivers.get(driverName);
    if (driver) {
      driver.terminate();
      this.drivers.delete(driverName);
      logger.log(`${driverName} unloaded.`);
    } else {
      logger.error(`${driverName} not found.`);
    }
  }

  getDriverStatus(driverName: string) {
    const driver = this.drivers.get(driverName);
    return driver ? driver.getStatus() : `${driverName} not loaded.`;
  }

  getDriver(driverName: string) {
    return this.drivers.get(driverName);
  }
}
