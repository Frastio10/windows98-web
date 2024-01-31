import { useEffect, useMemo, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import styled from "styled-components";
import { getApp } from "../configs";
import { FILE_EXTENSIONS } from "../configs/fileSystem";
import useOutsideAlerter from "../hooks/useOutsideAlerter";
import { useFileSystem } from "../hooks/zustand/useFileSystem";
import { useWindowState } from "../hooks/zustand/useWindowState";
import { FileProcessor } from "../libs/fileProcessor";
import { FileNode } from "../libs/fileSystem";
import { AppName, Vector2D } from "../types";

interface DesktopIconProps {
  file: FileNode;
  position: Vector2D;
}

export const DesktopIcon = ({ file, position }: DesktopIconProps) => {
  const { activeWindows, openWindow } = useWindowState();
  const { updateFileSystem } = useFileSystem();
  const [isSelected, setIsSelected] = useState(false);
  const [isRename, setIsRename] = useState(false);

  const elemRef = useRef<Rnd>();
  const titleRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { fileProcessor, data, program, app } = useMemo(() => {
    const fileProcessor = new FileProcessor(file);
    const data = fileProcessor.read();
    const program = data.fileMetadata.supportedPrograms![0];

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

  useEffect(() => {
    const handleOpen = () => {
      fileProcessor.run();
    };

    elemRef.current?.resizableElement.current?.addEventListener(
      "dblclick",
      handleOpen,
    );

    return () =>
      elemRef.current?.resizableElement.current?.removeEventListener(
        "dblclick",
        handleOpen,
      );
  }, [file]);

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

  useEffect(() => {
    const handleKeydown = (ev: KeyboardEvent) => {
      if (ev.key === "F2") {
        setIsRename(true);
        selectElementContents(titleRef.current);
        titleRef.current?.focus();
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
        height: "75px",
      }}
      style={{
        cursor: "auto !important",
      }}
      bounds=".bounds"
      // onDoubleClick={() => handleOpen(file)}
      onClick={() => setIsSelected(true)}
    >
      <Wrapper ref={wrapperRef}>
        <IconImage src={app.icons[2]} draggable={false} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextRename
            ref={titleRef}
            tabIndex={1}
            style={{
              // fix this ugly shiit
              background: isRename ? "white" : isSelected ? "blue" : "none",
              color: isRename ? "black" : "white",
              boxShadow: isSelected ? "0 0 0 1px white" : "",
              outline: isSelected ? "dashed 1px black" : "",
            }}
            contentEditable={isRename}
            dangerouslySetInnerHTML={{ __html: file.name }}
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
  padding: 0 4px;
`;
const RenameInput = styled.input`
  width: 100%;
  height: 14px;
  padding: 0 4px;
`;

const IconImage = styled.img`
  width: 40px;
  height: 40px;
`;

const Wrapper = styled.div`
  position: absolute;
  z-index: 1;
  height: 80px;
  width: 75px;
  text-align: center;
  /* display: flex; */
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;

  span {
    margin-top: 8px;
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
