import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useFileSystem } from "../../../hooks/os";
import { FileNode } from "../../../libs/fileSystem";
import IconResolver from "../../../libs/iconResolver";
import { themeStyles } from "../../shared/theme";
import { FileItem } from "../WindowsExplorer/SideBar/FileTree";

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
            src={IconResolver.resolve(child).small}
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
              <img
                src={IconResolver.resolve(child).small}
                className="w-4  h-4"
              />
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
  display: flex;
  flex-direction: column;
`;
