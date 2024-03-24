import { useWindow } from "../../hooks/os";
import { FileNode } from "../fileSystem";

type Command = {
  key: string;
  command: Function;
};

export default class ExeRunner {
  file: FileNode;
  commands: Command[];
  constructor(file: FileNode) {
    this.file = file;

    this.commands = [
      {
        key: "run",
        command: useWindow.getState().openWindow,
      },
    ];
  }

  run() {}
}
