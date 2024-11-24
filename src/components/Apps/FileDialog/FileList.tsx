import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useFileSystem } from "../../../hooks/os";
import { FileNode } from "../../../libs/fileSystem";
import { themeStyles } from "../../shared/theme";

interface FileListProps {
  files: FileNode[];
  isFileOnly: boolean;
  onDoubleClickFile: (file: FileNode) => void;
  onClickFile: (files: FileNode[]) => void;
}

function FileList({ files, onDoubleClickFile, onClickFile }: FileListProps) {
  const [selectedFileNodes, setSelectedFileNodes] = useState<FileNode[]>([]);
  const { fileSystem } = useFileSystem();

  const getIcon = (file: FileNode) => {
    const ext = file.name.split(".").pop()!;
    const settings = fileSystem.getStoredSettings();
    const storedIcon = settings.desktop?.iconsSrc?.[ext];

    return storedIcon?.[2];
  };

  useEffect(() => {
    setSelectedFileNodes([]);
  }, [files]);

  return (
    <InnerWrapper>
      {files.length ? (
        files.map((child) => (
          <FileItem
            key={child.id}
            src={getIcon(child)}
            active={!!selectedFileNodes.find((ch) => ch.id === child.id)}
            onClick={() => {
              setSelectedFileNodes((prevSelected) => {
                const isSelected = prevSelected.some(
                  (file) => file.id === child.id,
                );

                if (isSelected) {
                  return prevSelected.filter((file) => file.id !== child.id);
                } else {
                  // dont support multiple selection for now
                  // return [...prevSelected, child];
                  return [child];
                }
              });

              // if (!fileNameRef.current) return;
              // fileNameRef.current.value = child.name;
              // }
              onClickFile([child]);
            }}
            onDoubleClick={() => {
              onDoubleClickFile(child);
            }}
          >
            <div>
              <img src={getIcon(child)} className="w-4  h-4" />
            </div>
            <span>{child.name}</span>
          </FileItem>
        ))
      ) : (
        <p>
          Type the name of a program, folder, document, or Internet resource,
          and Windows will open it for you.
        </p>
      )}
    </InnerWrapper>
  );
}

export default FileList;

const InnerWrapper = styled.div`
  box-shadow: ${({ theme }) => theme.insetPixelatedBorder};
  width: 100%;
  padding: 2px;
  height: 100%;
  background: #fff;
`;

const FileItem = styled.div<{
  active?: boolean;
  src: string;
}>`
  color: ${(props) => (props.active ? "white" : "black")};
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 2px 0;

  span {
    padding: 0 2px;
    outline: ${(props) => (props.active ? "dashed 1px black" : "")};
    margin-left: 4px;
    background-color: ${(props) =>
      props.active
        ? themeStyles.highlightBackgroundColorPrimary
        : "transparent"};
  }

  div {
    position: relative;

    &::before {
      content: "";
      display: ${(props) => (props.active ? "block" : "none")};
      mask-size: 100%;
      mask-image: url(${(props) => props.src});
      -webkit-mask-image: url(${(props) => props.src});
      -webkit-mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: center;
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
      background-size: 2px 2px;
      background-position:
        0 0,
        0 2px,
        2px -2px,
        -2px 0px;
    }
  }
`;
