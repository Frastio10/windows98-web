import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useFileSystem } from "../../hooks/zustand/useFileSystem";
import { useWindowState } from "../../hooks/zustand/useWindowState";
import { FileNode } from "../../libs/fileSystem";
import { AppProps } from "../../types";
import { log } from "../../utils";
import {
  TopBarAction,
  TopBarActions,
  TopBarActionsProps,
} from "../Window/TopBarActions";

export const Notepad = ({ windowData }: AppProps) => {
  const { changeWindowTitle } = useWindowState();
  const { fileSystem, updateFileSystem } = useFileSystem();
  const [value, setValue] = useState("");
  const currentFile = useRef<FileNode | null>();
  const [isSaved, setIsSaved] = useState<null | boolean>(null);

  useEffect(() => {
    if (windowData.args) {
      const file = fileSystem.getNodeByPath(windowData.args);
      if (!file) return log("Failed to open file. File is not found");
      currentFile.current = file;

      changeWindowTitle(windowData.windowId, file.name + " - Notepad");
      setValue(file.content);
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
    file.content = value;
    currentFile.current = file;

    desktopNode?.addChild(file);
    updateFileSystem();
    setIsSaved(true);
  };

  const saveCurrent = () => {
    if (!currentFile.current) return saveAsNewFile();
    if (value === currentFile.current?.content) return;
    currentFile.current.content = value;
    updateFileSystem();

    setIsSaved(true);

    console.log("save current");
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
          onAction: () => console.log("hellopeppoep"),
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
