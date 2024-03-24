import React, { useEffect, useRef } from "react";

import { ShutDown } from "./Screens/ShutDown";
import { Desktop } from "./Desktop";
import { useFileSystem } from "../hooks/zustand/useFileSystem";
import { INITIAL_FILES } from "../configs/fileSystem";
import FileSystem from "../libs/fileSystem";
import { EmptyComponent } from "./shared/EmptyComponent";
import { useSystem } from "../hooks/os";

export const BootLoader = () => {
  const { isShutDown } = useSystem();
  const { fileSystem, initialize, isInitialized } = useFileSystem();
  const isLoaded = useRef(false);

  const isReadyToLoad = !isShutDown && isInitialized && isLoaded.current;

  const loadFileSystem = () => {
    const initialFiles = FileSystem.getSavedFiles();
    const rootFiles = initialFiles?.children || INITIAL_FILES;

    console.log({initialFiles})

    FileSystem.loadFilesFromArray(fileSystem.root, rootFiles);
    initialize();
    if (!initialFiles) fileSystem.updateStorageData();
  };

  useEffect(() => {
    if (!isLoaded.current && localStorage) {
      loadFileSystem();
      isLoaded.current = true;
    }
  }, []);

  if (isShutDown) return <ShutDown />;
  else if (isReadyToLoad) return <Desktop />;
  else return <EmptyComponent />;
};
