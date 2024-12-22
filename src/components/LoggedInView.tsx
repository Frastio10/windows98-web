import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useWindow } from "../hooks/os";
import { useFileSystem } from "../hooks/zustand/useFileSystem";
import Disk from "../libs/Disk";
import { FileNode } from "../libs/FileSystem";
import IconResolver from "../libs/IconResolver";
import System from "../libs/System";
import { Vector2D } from "../types";
import { DialogResult, MessageBoxButtons } from "./Apps/MessageBox";
import { DesktopIcon } from "./DesktopIcon";
import { Box } from "./shared/Box";
import { DefaultButton } from "./shared/Button";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";

export const LoggedInView = () => {
  const { activeWindows, closeWindowById } = useWindow();
  const { fileSystem, updateFileSystem } = useFileSystem();
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
        y: 10,
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

  const onDropFile = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (!file) return;
          const reader = new FileReader();

          reader.readAsText(file); // To read it as plain text

          reader.onload = () => {
            const sameNameFile = desktopFiles?.children.find(
              (f) => f.name === file.name,
            );

            if (sameNameFile) {
              return System.messageBox(undefined, {
                title: "Error",
                description: `${file.name} already exists. Do you want to replace it?`,
                buttons: MessageBoxButtons.OKCancel,
                width: 380,
                height: 120,
                cb: (r) => {
                  if (r.result === DialogResult.OK) {
                    const newFile = fileSystem.writeFile(
                      sameNameFile.path,
                      reader.result,
                    );
                    if (!newFile) return;

                    return closeWindowById(r.windowData.windowId);
                  } else if (r.result === DialogResult.Cancel) {
                    return closeWindowById(r.windowData.windowId);
                  }
                },
              });
            }

            const fileNode = new FileNode(file.name, false, desktopFiles);
            fileNode.content = reader.result;
            desktopFiles?.addChild(fileNode);
          };

          reader.onerror = () => {
            System.messageBox(undefined, {
              title: "Error",
              description: reader.error?.message || "",
              cb: (r) => System.closeWindow(r.windowData.windowId),
            });
          };
        }
      });
    } else {
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
      });
    }
  };

  return (
    <Wrapper>
      <Main
        className="bounds"
        onDragOver={(ev) => ev.preventDefault()}
        onDrop={onDropFile}
      >
        <EventHandlerOverlay
          onContextMenu={(ev) => {
            setShortcutBoxCoordinate(null);
            setShortcutBoxCoordinate({ x: ev.clientX, y: ev.clientY });
          }}
        />
        {activeWindows.map((w) => (
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
              display: "flex",
              justifyItems: "stretch",
              flexDirection: "column",
              textAlign: "left",
            }}
          >
            <DefaultButton>Window</DefaultButton>
            <DefaultButton>Window</DefaultButton>
            <DefaultButton>Window</DefaultButton>
            <DefaultButton>Window</DefaultButton>
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
