import clsx from "clsx";
import React, { useState } from "react";
import styled from "styled-components";
import { useFileSystem } from "../../../../hooks/os";
import { FileNode } from "../../../../libs/fileSystem";
import IconResolver from "../../../../libs/iconResolver";
import { iconSize, NOOP } from "../../../../utils";
import { themeStyles } from "../../../shared/theme";

export interface FileTreeNode extends FileNode {
  isRoot?: boolean;
  icon: string | null;
}

interface FileTreeProps {
  data: FileTreeNode[];
  onSelectPath?: (node: FileTreeNode) => void;
}

const FileTree: React.FC<FileTreeProps> = ({ data, onSelectPath = NOOP }) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const { fileSystem } = useFileSystem();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const toggleExpand = (item: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [item]: !prevExpanded[item],
    }));
  };

  const renderNode = (node: FileTreeNode) => {
    const file =
      node.path && !node.isRoot ? fileSystem.getNodeByPath(node.path) : null;
    const id = file?.id || node.id || node.name;
    const isExpanded = expanded[id] || false;
    const isExpandable = !!(file ? file.isDirectory : node.children);
    const children = node.children || (file ? file.children : null);

    const getIconSrc = () => {
      let iconSrc;

      if (file) {
        iconSrc = IconResolver.resolve(file);
      } else {
        iconSrc = IconResolver.getIconSrc("directory_closed");
      }

      if (isExpanded) iconSrc = IconResolver.getIconSrc("directory_open");

      if (node?.icon) {
        iconSrc = IconResolver.getIconSrc(node.icon);
      }

      return iconSrc;
    };

    return (
      <li
        key={node.name}
        style={{ paddingBottom: isExpanded ? "0" : "4px" }}
        className={clsx(
          "whitespace-nowrap",
          !!children?.length ? "active" : "",
          node.isRoot ? "root" : "",
        )}
      >
        {isExpandable && !node.isRoot && (
          <ToggleButton
            onClick={(e) => {
              e.preventDefault();
              toggleExpand(file?.id || node.id || node.name);
            }}
          >
            {isExpanded ? "-" : "+"}
          </ToggleButton>
        )}
        <FileItem
          src={getIconSrc().small}
          active={selectedId === id}
          className="inline-flex items-center flex-nowrap"
          onClick={(e) => {
            e.preventDefault();
            isExpandable && toggleExpand(file?.id || node.id || node.name);
            onSelectPath(node);
            setSelectedId(id);
          }}
        >
          <div className="shrink-0">
            <img src={getIconSrc().small} />
          </div>
          <span>{node.name}</span>
        </FileItem>
        {!!children?.length && (
          <ul
            className={clsx("sub-items")}
            style={{
              maxHeight: isExpanded ? "1000px" : "0",
              overflow: !isExpanded ? "hidden" : "",
            }}
          >
            {children
              .filter((ch) => ch.isDirectory)
              .map((child) => renderNode(child))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <MenuItems>
      {data
        .filter((ch) => ch.isDirectory)
        .map((node) => node.isDirectory && renderNode(node))}
    </MenuItems>
  );
};

export default FileTree;

export const FileItem = styled.div<{
  active?: boolean;
  src: string;
}>`
  gap: 4px;
  color: ${(props) => (props.active ? "white" : "black")};
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  // padding: 2px 0;

  span {
    // padding: 0 2px;
    outline: ${(props) => (props.active ? "dashed 1px black" : "")};
    // margin-left: 4px;
    background-color: ${(props) =>
      props.active
        ? themeStyles.highlightBackgroundColorPrimary
        : "transparent"};
  }

  div {
    flex-shrink: 0;
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

const MenuItems = styled.ul`
  list-style-type: none;
  padding: 0;

  li {
    padding: 4px 0;

    &.active {
      > a {
        color: #333;
        font-weight: 700;
      }
    }

    .sub-items {
      padding-left: 20px;
      // overflow-y: hidden;
      // overflow-x: clip;
      // overflow-x: hidden;
    }
  }

  li.root > .sub-items {
    padding-left: 7px;
  }

  li {
    position: relative;
    // border-left: 1px dashed #000;

    &:not(.root)::before {
      position: relative;
      top: -6px;
      width: 15px;
      border-bottom: 1px dashed #000;
      content: "";
      display: inline-block;
    }

    &:last-child {
      border: none;
      padding-bottom: 0;
    }

    &:not(.root)::after {
      content: "";
      width: 1px;
      height: 100%;
      border-left: 1px dashed #000;
      position: absolute;
      left: 0;
      top: 0;
    }

    &:not(.root):last-child::after {
      content: "";
      width: 1px;
      height: 12px;
      border-left: 1px dashed #000;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
`;

const ToggleButton = styled.button`
  background: #fff;
  border: 1px solid #000;
  width: 10px;
  height: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  position: absolute;
  left: -5px;
  outline: none;
  cursor: pointer;
  margin-right: 5px;
  font-size: 12px;
  top: 8px;
`;
