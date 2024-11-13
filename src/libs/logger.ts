
type Transport = (message: string) => void;

interface LoggerConfig {
  transport?: Transport;
  prefix?: string;
  timestamp?: boolean; // Optional timestamp control
}

class Logger {
  private transport: Transport;
  private prefix: string;
  private timestampEnabled: boolean;

  constructor(config: LoggerConfig = { transport: console.log }) {
    this.transport = config.transport || console.log;
    this.prefix = config.prefix || "";
    this.timestampEnabled = config.timestamp !== false; // Default to true if not specified
  }

  log(...args: any[]) {
    this.transport(this.formatMessage(...args));
  }

  info(...args: any[]) {
    this.transport(`INFO: ${this.formatMessage(...args)}`);
  }

  warn(...args: any[]) {
    this.transport(`WARN: ${this.formatMessage(...args)}`);
  }

  error(...args: any[]) {
    this.transport(`ERROR: ${this.formatMessage(...args)}`);
  }

  private formatMessage(...args: any[]): string {
    const formattedArgs = args.map((arg) =>
      typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg),
    );

    let message = formattedArgs.join(" ");

    if (this.prefix) {
      message = `[${this.prefix}] ${message}`;
    }

    if (this.timestampEnabled) {
      const timestamp = this.getFormattedTimestamp();
      message = `${timestamp} ${message}`;
    }

    return message;
  }

  private getFormattedTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // ANSI escape codes for cyan color and reset
    return `\x1b[36m[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]\x1b[0m`;
  }
}

export const logger = new Logger({ timestamp: true });

