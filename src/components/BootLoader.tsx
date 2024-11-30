import React, { useEffect, useRef, useState } from "react";

import { ShutDown } from "./Screens/ShutDown";
import { Desktop } from "./Desktop";
import { useFileSystem } from "../hooks/zustand/useFileSystem";
import { INITIAL_FILES } from "../configs/fileSystem";
import FileSystem from "../libs/fileSystem";
import { EmptyComponent } from "./shared/EmptyComponent";
import { useSystem, useWindow } from "../hooks/os";
import System from "../libs/system";

export const BootLoader = () => {
  const { isShutDown } = useSystem();
  const { fileSystem, initialize, isInitialized } = useFileSystem();
  const isLoaded = useRef(false);
  const [fade, setFade] = useState(false);

  const isReadyToLoad =
    !isShutDown && isInitialized && isLoaded.current && !!typeof window;

  const loadFileSystem = () => {
    const initialFiles = FileSystem.getSavedFiles();
    const rootFiles = initialFiles?.children || INITIAL_FILES;

    FileSystem.loadFilesFromArray(fileSystem.root, rootFiles);
    initialize();
    if (!initialFiles) fileSystem.updateStorageData();
  };

  useEffect(() => {
    setFade(true);
    if (!isLoaded.current && localStorage) {
      System.getInstance().loadDrivers();
      loadFileSystem();

      isLoaded.current = true;
    }
  }, []);

  // if (isShutDown) return <ShutDown />;
  // else if (isReadyToLoad)
  //   return <Desktop />;
  // else return <EmptyComponent />;

  let content;
  if (isShutDown) {
    content = <ShutDown />;
  } else if (isReadyToLoad) {
    content = <Desktop />;
  } else {
    content = <EmptyComponent />;
  }

  return (
    <div className="bg-black w-full h-full">
      <div
        className="w-full h-full transition duration-[5000ms]"
        style={{
          opacity: fade ? 1 : 0,
        }}
      >
        {content}
      </div>
    </div>
  );
};
