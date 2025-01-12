import React, { useEffect, useRef, useState } from "react";

import { ShutDown } from "./Screens/ShutDown";
import { Desktop } from "./Desktop";
import { useFileSystem } from "../hooks/zustand/useFileSystem";
import { INITIAL_FILES } from "../configs/fileSystem";
import FileSystem, { FileNode } from "../libs/FileSystem";
import { EmptyComponent } from "./shared/EmptyComponent";
import { useSystem, useWindow } from "../hooks/os";
import System from "../libs/System";
import Disk from "../libs/Disk";
import packageJson from "../../package.json";
import { NOOP } from "../utils";
import { DialogResult, MessageBoxButtons } from "./Apps/MessageBox";
import { logger } from "../libs/Logger";

export const BootLoader = () => {
  const { isShutDown } = useSystem();
  const { fileSystem, initialize, isInitialized } = useFileSystem();
  const isLoaded = useRef(false);
  const [fade, setFade] = useState(false);

  const versionInterval = useRef(0);

  const isReadyToLoad =
    !isShutDown && isInitialized && isLoaded.current && !!typeof window;

  const loadFileSystem = async () => {
    const initialFiles = await FileSystem.getSavedFiles();
    const rootFiles = initialFiles?.children || INITIAL_FILES;

    FileSystem.loadFilesFromArray(fileSystem.root, rootFiles);
    initialize();
    if (!initialFiles) fileSystem.updateStorageData();
  };

  const versionCheck = async () => {
    let version = await Disk.getInstance().get("version");
    const currentVersion = packageJson.version;
    if (!version) {
      // Disk.getInstance().set("version", currentVersion);
      version = currentVersion;
    }

    if (version !== currentVersion) {
      logger.error(
        `Current version '${currentVersion}' is invalid or not supported.`,
      );
      clearInterval(versionInterval.current);
      System.messageBox(undefined, {
        title: "Invalid version",
        description:
          "Your current version is expired, this may cause an error in some programs if you don't reset your data. Reset your data?",
        height: 150,
        buttons: MessageBoxButtons.OK,
        cb: async (r) => {
          if (r.result === DialogResult.OK) {
            await Disk.getInstance().set("version", "");
            await Disk.getInstance().set("fs", "");

            // fileSystem.updateStorageData();
            window.location.reload();
          }
        },
      });
    }
  };

  const initialLoad = async () => {
    if (!isLoaded.current && localStorage) {
      await System.getInstance().loadDrivers();
      let installedVersion = await Disk.getInstance().get("version");
      const currentVersion = packageJson.version;
      logger.log(
        `Installed Version: ${installedVersion}; Latest Version: ${currentVersion}; Status: ${currentVersion === installedVersion ? "\x1b[36mup-to-date\x1b[0m" : "\x1b[31mnot up-to-date\x1b[0m"};`,
      );

      versionCheck();
      versionInterval.current = setInterval(() => {
        versionCheck();
      }, 10000);

      await loadFileSystem();
    }
  };

  useEffect(() => {
    setFade(true);

    initialLoad();

    isLoaded.current = true;
  }, []);

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
