import { create } from "zustand";
import FileSystem from "../../libs/FileSystem";

interface FileSystemState {
  fileSystem: FileSystem;
  isInitialized: boolean;

  initialize: (isInitialized?: boolean) => void;
  updateFileSystem: (fs?: FileSystem) => Promise<void>;
}

export const useFileSystem = create<FileSystemState>((set, get) => ({
  fileSystem: FileSystem.getInstance(),
  isInitialized: false,

  updateFileSystem: async (fs) => {
    const newFs = fs || get().fileSystem;
    await newFs.updateStorageData();
    set({ fileSystem: newFs });
  },

  // what is this syntax zustand....
  initialize: (isInitialized = true) => set((state) => ({ isInitialized })),
}));
