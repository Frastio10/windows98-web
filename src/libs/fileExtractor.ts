export class FileExtractor {
  static exe(str: string) {
    const split = str.split(" ");
    const command = split[0];
    const appName = split[1];

    return {
      command,
      appName,
    };
  }

  static getFileName(str: string) {
    const supportedExtensions = ["exe"];
    const lowerCaseString = str.toLowerCase();

    for (const ext of supportedExtensions) {
      const lowerCaseExt = `.${ext.toLowerCase()}`;

      if (lowerCaseString.endsWith(lowerCaseExt)) {
        return str.slice(0, -ext.length - 1); // Remove the extension and the dot
      }
    }
  }
}
