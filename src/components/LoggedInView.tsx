import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useWindow } from "../hooks/os";
import { useFileSystem } from "../hooks/zustand/useFileSystem";
import Disk from "../libs/disk";
import IconResolver from "../libs/iconResolver";
import System from "../libs/system";
import { Vector2D } from "../types";
import { DesktopIcon } from "./DesktopIcon";
import { Box } from "./shared/Box";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";

export const LoggedInView = () => {
  const { activeWindows } = useWindow();
  const { fileSystem } = useFileSystem();
  const desktopFiles = fileSystem.getDesktopFiles();
  const [shortcutBoxCoordinate, setShortcutBoxCoordinate] =
    useState<Vector2D | null>(null);

  useEffect(() => {
    const hideShortcutBox = () => {
      setShortcutBoxCoordinate(null);
    };
    document.addEventListener("click", hideShortcutBox);
    document.addEventListener("keydown", hideShortcutBox);

    return () => {
      document.removeEventListener("click", hideShortcutBox);
      document.removeEventListener("keydown", hideShortcutBox);
    };
  }, []);

  const desktopSettings = useMemo(() => {
    return fileSystem.getStoredSettings().desktop;
  }, []);

  const getDesktopIcons = () => {
    const icons = desktopFiles?.children.map((file, index) => {
      let storedData = desktopSettings.icons;

      const iconData = {
        x: index * 75 + (index > 0 ? 10 : 0),
        y: 0,
        ...storedData[file.id],
      };

      storedData[file.id] = iconData;

      return {
        file,
        iconData,
      };
    });

    const newSettings = {
      ...fileSystem.getStoredSettings(),
      ...{
        desktop: desktopSettings,
      },
    };

    fileSystem.updateStoredSettings(newSettings);

    return icons || [];
  };

  // console.log(
  //   IconResolver
  //     .resolve
  //     // fileSystem.getNodeByPath("C:/WINDOWS/Desktop/Notepad.exe")!,
  //     (),
  // );

  return (
    <Wrapper>
      <Main className="bounds">
        <EventHandlerOverlay
          onContextMenu={(ev) => {
            setShortcutBoxCoordinate(null);
            setShortcutBoxCoordinate({ x: ev.clientX, y: ev.clientY });
          }}
        />
        {activeWindows.map((w, i) => (
          <Window key={w.windowId} windowData={w} />
        ))}

        {getDesktopIcons().map((icon) => (
          <DesktopIcon
            key={icon.file.id}
            file={icon.file}
            position={{ x: icon.iconData.x, y: icon.iconData.y }}
          />
        ))}

        {shortcutBoxCoordinate && (
          <Box
            style={{
              top: shortcutBoxCoordinate.y,
              left: shortcutBoxCoordinate.x,
              position: "absolute",
              width: "200px",
            }}
          >
            Window
          </Box>
        )}
      </Main>
      <Bottom>
        <Taskbar />
      </Bottom>
    </Wrapper>
  );
};

const EventHandlerOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  background: ${({ theme }) => theme.defaultBackground};
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Bottom = styled.div`
  position: relative;
  height: 25px;
`;

const Main = styled.div`
  flex: 1 1 0;
  position: relative;
`;
