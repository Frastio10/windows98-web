import React, { useEffect, useRef } from "react";
import LZString from "lz-string";
import styled from "styled-components";
import { FileNode } from "../../../libs/FileSystem";

const GalleryCard = ({
  file,
  onClick,
}: {
  file: FileNode;
  onClick: (file: FileNode) => void;
}) => {
  return (
    <Card onClick={() => onClick(file)}>
      <img src={LZString.decompressFromUTF16(file.content)} />
    </Card>
  );
};

function Gallery({
  files,
  onSelectImage,
}: {
  files: FileNode[];
  onSelectImage: (file: FileNode) => void;
  [key: string]: any;
}) {
  const galleryRef = useRef<HTMLDivElement>(null);
  galleryRef.current?.scrollTo({ left: galleryRef.current.scrollWidth });

  return (
    <Wrapper ref={galleryRef}>
      {files.map((file) => (
        <GalleryCard key={file.id} file={file} onClick={onSelectImage} />
      ))}
    </Wrapper>
  );
}

export default Gallery;

const Card = styled.div`
  width: 80px;
  flex-shrink: 0;
  height: 60px;
  // border: 1px solid green;
`;

const Wrapper = styled.div`
  display: flex;
  overflow: auto;
  gap: 2px;
  padding: 2px;
`;
