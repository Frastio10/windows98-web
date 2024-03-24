import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useWindow } from "../../hooks/os";
import { useFileSystem } from "../../hooks/zustand/useFileSystem";
import { FileNode } from "../../libs/fileSystem";
import { AppProps } from "../../types";
import { log } from "../../utils";
import {
  TopBarAction,
  TopBarActions,
  TopBarActionsProps,
} from "../Window/TopBarActions";
import LZString from "lz-string";

export const Notepad = ({ windowData }: AppProps) => {
  const { changeWindowTitle } = useWindow();
  const { fileSystem, updateFileSystem } = useFileSystem();
  const [value, setValue] = useState("");

  const [currentFile, setCurrentFile] = useState<FileNode | null>(null);
  const [isSaved, setIsSaved] = useState<null | boolean>(null);

  useEffect(() => {
    if (windowData.args) {
      const file = fileSystem.getNodeByPath(windowData.args);
      if (!file)
        return log(
          `Failed to open file. File '${windowData.args}' is not found`,
        );
      setCurrentFile(file);

      changeWindowTitle(windowData.windowId, file.name + " - Notepad");
      setValue(LZString.decompressFromUTF16(file.content));
      setIsSaved(true);
    }
  }, []);

  useEffect(() => {
    if (isSaved !== null) {
      const savedMarker = isSaved === false ? "*" : "";
      let str = savedMarker + windowData.title.replace("*", "");

      changeWindowTitle(windowData.windowId, str);
    }
  }, [isSaved]);

  const saveAsNewFile = () => {
    const filename = prompt("*.txt") || "Untitled";
    const desktopNode = fileSystem.getNodeByPath("C:/Desktop");
    const file = new FileNode(filename, false, desktopNode);

    changeWindowTitle(windowData.windowId, filename + " - Notepad");
    file.content = LZString.compressToUTF16(value);
    setCurrentFile(file);

    desktopNode?.addChild(file);
    updateFileSystem();
    setIsSaved(true);
  };

  const openNewInstance = () => {
    setCurrentFile(null);
    setValue("");
    changeWindowTitle(windowData.windowId, null);
    setIsSaved(true);
  };

  const saveCurrent = () => {
    if (!currentFile) return saveAsNewFile();
    if (value === currentFile.content) return;

    // this is so ugly.  i have no fucking idea why prevState doesnt work with classes
    const file = currentFile;
    file.content = LZString.compressToUTF16(value);
    setCurrentFile(file);

    updateFileSystem();

    setIsSaved(true);
  };

  const topBarActions: TopBarAction[] = [
    {
      title: "File",
      children: [
        {
          title: "File",
          onAction: () => console.log("pepo"),
        },
        {
          title: "Open...",
          onAction: () => openNewInstance(),
        },
        {
          title: "Save",
          onAction: () => saveCurrent(),
        },
        {
          title: "Save As",
          shortcutLetter: "A",
          onAction: () => {
            saveAsNewFile();
          },
        },
      ],
    },
    {
      title: "Edit",
      onAction: () => console.log("hellopeppoep"),
    },
    {
      title: "Search",
      onAction: () => console.log("hellopeppoep"),
    },
    {
      title: "Help",
      onAction: () => console.log("hellopeppoep"),
    },
  ];
  return (
    <Wrapper>
      <TopBarActions actions={topBarActions} />
      <TextAreaWrapper>
        <TextArea
          defaultValue={value}
          onChange={(ev) => {
            setValue(ev.target.value);
            setIsSaved(false);
          }}
          onKeyDown={(ev) => {
            if (ev.ctrlKey && ev.key === "s") {
              ev.preventDefault();
              saveCurrent();
            }
          }}
        ></TextArea>
      </TextAreaWrapper>
    </Wrapper>
  );
};

const TextAreaWrapper = styled.div`
  box-shadow: ${({ theme }) => theme.insetPixelatedBorder};
  width: 100%;
  padding: 2px;
  height: 100%;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  overflow: scroll;
  white-space: pre;
  padding-right: calc(${({ theme }) => theme.scrollbarSize} + 2px);
  padding-bottom: ${({ theme }) => theme.scrollbarSize};
`;

const Wrapper = styled.div`
  display: flex;
  font-size: 12px;
  gap: 2px;
  height: 100%;
  padding: 2px;
  flex-direction: column;
`;
