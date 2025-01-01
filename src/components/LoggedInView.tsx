import { useEffect, useMemo, useRef, useState } from "react";
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
  const mainRef = useRef<HTMLDivElement>(null);
  const { activeWindows, closeWindowById } = useWindow();
  const { fileSystem, updateFileSystem } = useFileSystem();
  const desktopFiles = fileSystem.getDesktopFiles();
  const [desktopIcons, setDesktopIcons] = useState<
    { file: FileNode; iconData: any }[]
  >([]);
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

  useEffect(() => {
    const calculateDesktopIcons = () => {
      if (!mainRef.current) return [];

      const icons = desktopFiles?.children.map((file, index) => {
        let storedData = desktopSettings.icons;

        const parentHeight = mainRef.current!.clientHeight;
        const parentWidth = mainRef.current!.clientWidth;

        const iconWidth = 75;
        const iconHeight = 80;
        const margin = 1;

        const foundIndex = storedData.findIndex((d: any) => d.id === file.id);

        // Calculate the number of icons that can fit in a column
        const maxIconsInColumn = Math.floor(
          parentHeight / (iconHeight + margin),
        );

        const column = Math.floor(index / maxIconsInColumn);
        const row = index % maxIconsInColumn;

        let iconData = {
          x: column * (iconWidth + margin),
          y: row * (iconHeight + margin),
          id: file.id,
          ...(foundIndex >= 0 ? storedData[foundIndex] : {}),
        };

        // If the icon exceeds the parent height, it will move to the next column
        if (iconData.y > parentHeight - iconHeight - margin) {
          iconData.y = 0;
          iconData.x = (column + 1) * (iconWidth + margin); // Move to the next column
        }

        if (foundIndex >= 0) {
          storedData[foundIndex] = iconData;
        } else {
          storedData.push(iconData);
        }

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

    setDesktopIcons(calculateDesktopIcons());
  }, [mainRef.current, desktopFiles]); // Trigger effect when `mainRef` or `desktopFiles` change

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
        ref={mainRef}
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

        {desktopIcons.map((data) => (
          <DesktopIcon
            key={data?.file.id}
            file={data?.file}
            position={{ x: data.iconData.x, y: data.iconData.y }}
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
