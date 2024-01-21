import { create } from "zustand";
import FileSystem from "../../libs/fileSystem";

interface FileSystemState {
  fileSystem: FileSystem;
  isInitialized: boolean;

  initialize: (isInitialized?: boolean) => void;
}

export const useFileSystem = create<FileSystemState>((set, get) => ({
  fileSystem: FileSystem.getInstance(),
  isInitialized: false,

  initialize: (isInitialized = true) => set((state) => ({ isInitialized })),
}));
