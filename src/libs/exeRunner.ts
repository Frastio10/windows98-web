import { useWindowState } from "../hooks/zustand/useWindowState";
import { FileNode } from "./fileSystem";

type Command = {
  key: string;
  command: Function;
};

class ExeRunner {
  file: FileNode;
  commands: Command[];
  constructor(file: FileNode) {
    this.file = file;

    this.commands = [
      {
        key: "run",
        command: useWindowState.getState().openWindow,
      },
    ];
  }

  run() {}
}
