import { DialogResult } from "../components/Apps/MessageBox";

export type FileType = {
  key: string;
  title: string;
  ext: null | string;
};

export type FileDialogResult = {
  filePaths: string[];
  status: DialogResult;
};

export interface BaseFileDialogOpts {
  initialPath?: string;
  onResult: (e: FileDialogResult) => void;

  defaultFileType?: FileType;
  fileTypes?: FileType[];

  defaultFileName?: string;

  isFileOnly?: boolean;

  isMultiple?: boolean;
  overwritePrompt?: boolean;
}
