import React, { useEffect, useRef } from "react";
import LZString from "lz-string";
import styled from "styled-components";
import { FileNode } from "../../../libs/FileSystem";
import { useFileSystem } from "../../../hooks/os";

const GalleryCard = ({
  file,
  onClick,
  isActive,
  ...rest
}: {
  file: FileNode;
  isActive: boolean;
  onClick: (file: FileNode | null) => void;
  [key: string]: any;
}) => {
  const { fileSystem, updateFileSystem } = useFileSystem();
  return (
    <Card
      onClick={() => onClick(file)}
      style={{
        border: isActive ? "2px solid black" : "2px solid transparent",
      }}
      {...rest}
    >
      {isActive && (
        <span
          className="cursor-pointer bg-black text-white w-4 h-4 absolute top-[-4px] left-[-4px] rounded-full flex items-center justify-center"
          onClick={() => {
            fileSystem.removeNode(file.path);
            updateFileSystem();

            onClick(null);
          }}
        >
          X
        </span>
      )}
      <img src={LZString.decompressFromUTF16(file.content)} />
    </Card>
  );
};

function Gallery({
  files,
  selectedFile,
  onSelectImage,
}: {
  files: FileNode[];
  onSelectImage: (file: FileNode | null) => void;
  selectedFile: FileNode | null;
}) {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    galleryRef.current?.scrollTo({ left: galleryRef.current.scrollWidth });
  }, [files]);

  return (
    <Wrapper ref={galleryRef}>
      {files.map((file) => (
        <GalleryCard
          key={file.id}
          file={file}
          onClick={onSelectImage}
          isActive={selectedFile?.id == file.id}
        />
      ))}
    </Wrapper>
  );
}

export default Gallery;

const Card = styled.div`
  width: 80px;
  flex-shrink: 0;
  height: 60px;
  position: relative;
  cursor: pointer;
  // border: 1px solid green;
`;

const Wrapper = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: unset;
  gap: 2px;
  padding: 2px;
`;
