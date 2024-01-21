import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import styled from "styled-components";
import { getApp } from "../configs";
import { FILE_EXTENSIONS } from "../configs/fileSystem";
import useOutsideAlerter from "../hooks/useOutsideAlerter";
import { useWindowState } from "../hooks/zustand/useWindowState";
import { FileExtractor } from "../libs/fileExtractor";
import { FileNode } from "../libs/fileSystem";
import { AppName, Vector2D } from "../types";

interface DesktopIconProps {
  file: FileNode;
  position: Vector2D;
}

export const DesktopIcon = ({ file, position }: DesktopIconProps) => {
  const { activeWindows, openWindow } = useWindowState();
  const [isSelected, setIsSelected] = useState(false);

  const elemRef = useRef<Rnd>();

  const exeData = FileExtractor.exe(file.content);
  const app = getApp(exeData.appName as AppName);

  useOutsideAlerter([elemRef.current?.resizableElement!], () => {
    setIsSelected(false);
  });

  const handleExe = (str: string) => {
    const file = FileExtractor.exe(str);
    if (file.command === "run") {
      openWindow(file.appName as AppName);
    }
  };

  const handleOpen = (file: FileNode) => {
    if (file.name.includes(FILE_EXTENSIONS.EXE)) {
      handleExe(file.content);
    }
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
        width: '75px',
        height: '75px'
      }}
      style={{
        cursor: "auto !important",
      }}
      bounds=".bounds"
      onDoubleClick={() => handleOpen(file)}
      onClick={() => setIsSelected(true)}
    >
      <Wrapper>
        <IconImage src={app.icons[2]} draggable={false} />
        <span style={{ background: isSelected ? "blue" : "none" }}>
          {FileExtractor.getFileName(file.name)}
        </span>
      </Wrapper>
    </Rnd>
  );
};

const IconImage = styled.img`
  width: 40px;
  height: 40px;
`;

const Wrapper = styled.div`
  position: absolute;
  z-index: 1;
  height: 75px;
  width: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  span {
    margin-top: 8px;
    font-size: 13px;
    color: white;
  }
`;
