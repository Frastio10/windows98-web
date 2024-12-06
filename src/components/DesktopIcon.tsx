import { useEffect, useMemo, useRef, useState } from "react";
import { DraggableEvent } from "react-draggable";
import { DraggableData, Rnd } from "react-rnd";
import styled from "styled-components";
import { getApp } from "../configs";
import { FILE_EXTENSION } from "../configs/fileSystem";
import { useWindow } from "../hooks/os";
import useOutsideAlerter from "../hooks/useOutsideAlerter";
import { useFileSystem } from "../hooks/zustand/useFileSystem";
import { FileProcessor } from "../libs/FileProcessor";
import { FileNode } from "../libs/FileSystem";
import IconResolver from "../libs/IconResolver";
import { App, AppName, Vector2D } from "../types";
import { getFileExtension, iconSize } from "../utils";
import { IconSize } from "./shared/icon";
import { themeStyles } from "./shared/theme";

interface DesktopIconProps {
  file: FileNode;
  position: Vector2D;
}

export const DesktopIcon = ({ file, position }: DesktopIconProps) => {
  const { activeWindows, openWindow } = useWindow();
  const { fileSystem, updateFileSystem } = useFileSystem();
  const [isSelected, setIsSelected] = useState(false);
  const [isRename, setIsRename] = useState(false);

  const elemRef = useRef<Rnd>();
  const titleRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { fileProcessor, data, program, app } = useMemo(() => {
    const fileProcessor = new FileProcessor(file);
    const data = fileProcessor.read();
    const program = data.fileMetadata.executables![0];

    const app = getApp(program);

    return {
      fileProcessor,
      data,
      program,
      app,
    };
  }, [file]);

  useOutsideAlerter([wrapperRef], () => {
    setIsSelected(false);
    setIsRename(false);
  });

  function selectElementContents(el: any) {
    let range, sel;

    if (window.getSelection && document.createRange) {
      range = document.createRange();
      range.selectNodeContents(el);
      sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }

  const handleRenameFile = () => {
    setIsRename(true);
    selectElementContents(titleRef.current);
    titleRef.current?.focus();
  };

  const handleRemoveFile = () => {
    fileSystem.removeNode(file.path);
    updateFileSystem();
  };

  useEffect(() => {
    const handleKeydown = (ev: KeyboardEvent) => {
      ev.stopPropagation();
      console.log(ev.key);
      if (ev.key === "F2" || ev.key === "r") {
        handleRenameFile();
      }

      if (ev.key === "Delete" || ev.key === "Backspace") {
        handleRemoveFile();
      }
    };

    if (isSelected) {
      document.addEventListener("keydown", handleKeydown);
    } else {
      document.removeEventListener("keydown", handleKeydown);
    }

    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isSelected, isRename]);

  const renameFile = () => {
    titleRef.current?.blur();
    file.rename(titleRef.current!.innerText);
    setIsRename(false);
    updateFileSystem();
  };

  const handleDragIcon = (_: DraggableEvent, d: DraggableData) => {
    const storedData = fileSystem.getStoredSettings();
    const iconSettings = storedData.desktop.icons[file.id];

    iconSettings.x = d.lastX;
    iconSettings.y = d.lastY;

    fileSystem.updateStoredSettings(storedData);

    updateFileSystem();
  };
  // const ext = file.name.split(".").pop()!;
  // const settings = fileSystem.getStoredSettings();
  // const storedIcon = settings.desktop?.iconsSrc?.[ext];

  // return storedIcon?.[2] || app.icons![2];

  const getIcon = (app: App) => {
    const icon = IconResolver.resolve(file);
    return icon.big;
  };

  return (
    <Rnd
      ref={(elem) => {
        if (elem) elemRef.current = elem;
      }}
      enableResizing={false}
      default={{
        x: position.x,
        y: position.y,
        width: "75px",
        height: "85px",
      }}
      style={{
        cursor: "auto !important",
      }}
      bounds=".bounds"
      // onDoubleClick={() => handleOpen(file)}
      onDragStop={handleDragIcon}
      onClick={() => setIsSelected(true)}
    >
      <Wrapper ref={wrapperRef}>
        <div
          className="w-full flex justify-center flex-grow"
          onDoubleClick={() => fileProcessor.run()}
        >
          <IconWrapper src={getIcon(app!)} active={isSelected}>
            {getFileExtension(file.name) === FILE_EXTENSION.LNK && (
              <IconSize
                className="absolute bottom-0  h-full z-[1] object-contain"
                iconKey={"link_overlay"}
                size="medium"
              />
            )}
            <IconImage src={getIcon(app!)} draggable={false} />
          </IconWrapper>
        </div>
        <div
          style={{
            display: "flex",
            // justifyContent: "center",
            alignItems: "start",
            height: "30px",
          }}
        >
          <TextRename
            ref={titleRef}
            tabIndex={1}
            onDoubleClick={handleRenameFile}
            style={{
              // fix this ugly shiit
              background: isRename
                ? "white"
                : isSelected
                  ? themeStyles.highlightBackgroundColorPrimary
                  : "none",
              color: isRename ? "black" : "white",
              boxShadow: isSelected ? "0 0 0 1px white" : "",
              outline: isSelected ? "dashed 1px black" : "",
            }}
            contentEditable={isRename}
            dangerouslySetInnerHTML={{ __html: file.name.replace(".lnk", "") }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                ev.preventDefault();
                renameFile();
              }
            }}
          ></TextRename>
        </div>
      </Wrapper>
    </Rnd>
  );
};

const TextRename = styled.span`
  min-width: 30px;
  // height: 30px;
  padding: 0 4px;
`;

const RenameInput = styled.input`
  width: 100%;
  height: 14px;
  padding: 0 4px;
`;

const IconWrapper = styled.div<{ src: string; active: boolean }>`
  position: relative;

  &::before {
    content: "";
    height: 40px;
    display: ${(props) => (props.active ? "block" : "none")};
    mask-size: 100%;
    mask-image: url(${(props) => props.src});
    -webkit-mask-image: url(${(props) => props.src});
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(
        45deg,
        rgba(0, 0, 170, 0.5) 25%,
        transparent 25%
      ),
      linear-gradient(-45deg, rgba(0, 0, 170, 0.5) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgba(0, 0, 170, 0.5) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(0, 0, 170, 0.5) 75%);
    background-size: 3px 3px;
    background-position:
      0 0,
      0 2px,
      2px -2px,
      -2px 0px;
  }
`;

const IconImage = styled.img`
  width: 40px;
  height: 40px;
  position: relative;
`;

const Wrapper = styled.div`
  position: absolute;
  z-index: 1;
  height: 80px;
  width: 75px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;

  span {
    // margin-top: 8px;
    font-size: 13px;
    color: white;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
