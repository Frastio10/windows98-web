import { useRef, useState } from "react";
import styled from "styled-components";
import api from "../../../api";
import { useFileSystem } from "../../../hooks/os";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter";
import { FileProcessor } from "../../../libs/FileProcessor";
import { FileNode } from "../../../libs/FileSystem";
import IconResolver from "../../../libs/IconResolver";
import { AppProps } from "../../../types";
import { NOOP } from "../../../utils";
import { DefaultButton } from "../../shared/Button";
import { Divider, LongDivider } from "../../shared/Dividers";
import { IconSize } from "../../shared/icon";
import { themeStyles } from "../../shared/theme";
import { TopBarAction, TopBarActions } from "../../Window/TopBarActions";
import SidebarNavigation from "./SideBar";
import { FileTreeNode, FileItem } from "./SideBar/FileTree";

type ExplorerBarType = "search" | "favorites" | "history" | "folders";

type ToolbarSelectAction = {
  title: string;
  onAction: () => void;
};

const ToolbarAction = ({
  iconKey,
  title,
  actions,
  onClick,
}: {
  iconKey: string;
  title: string;
  actions?: ToolbarSelectAction[];
  onClick?: () => void;
}) => {
  return (
    <ToolbarActionWrapper>
      <ToolbarButton onClick={onClick}>
        <ToolbarButtonIcon>
          <IconSize className="w-5 mb-1" iconKey={iconKey} size="medium" />
        </ToolbarButtonIcon>

        {title}
      </ToolbarButton>
      {actions?.length && (
        <div className="flex items-center">
          <IconSize iconKey={"pan-down-symbolic"} size="small" />
        </div>
      )}
    </ToolbarActionWrapper>
  );
};

export const WindowsExplorer = ({ windowData }: AppProps) => {
  const { fileSystem, updateFileSystem } = useFileSystem();
  const addressBarRef = useRef<HTMLInputElement>(null);
  const addressListRef = useRef<HTMLDivElement>(null);

  const [showList, setShowList] = useState(false);
  const [suggestedFileNode, setSuggestedFileNode] = useState<FileNode[]>([]);
  const [fileNode, setFileNode] = useState<FileNode | null>(null);

  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  const [highlightedFile, setHighlightedFile] = useState<string | null>(null);

  const [explorerBar, setExplorerBar] = useState<ExplorerBarType | null>(
    "folders",
  );

  const topBarActions: TopBarAction[] = [
    {
      title: "File",
      children: [
        {
          title: "File",
          onAction: () => console.log("pepo"),
        },
        {
          title: "File",
          onAction: () => console.log("pepo"),
        },
        {
          title: "File",
          onAction: () => console.log("pepo"),
        },
      ],
    },
    {
      title: "Edit",
      onAction: () => console.log("hellopeppoep"),
    },
    {
      title: "View",
      onAction: () => console.log("hellopeppoep"),
    },
    {
      title: "Go",
      onAction: () => console.log("hellopeppoep"),
    },
    {
      title: "Favorites",
      onAction: () => console.log("hellopeppoep"),
    },
    {
      title: "Tools",
      onAction: () => console.log("hellopeppoep"),
    },
    {
      title: "Help",
      onAction: () => console.log("hellopeppoep"),
    },
  ];

  function changeLastPathSegment(path: string, newSegment: string) {
    const pathSegments = path.split("/"); // Split the path by backslashes
    if (pathSegments.length > 1) {
      pathSegments[pathSegments.length - 1] = newSegment; // Replace the last segment
    }
    return pathSegments.join("/"); // Join the segments back together
  }

  const closeExplorerBar = () => {
    setExplorerBar(null);
  };

  useOutsideAlerter([addressListRef], () => {
    setShowList(false);
  });

  const onSelectPathSidebar = (node: FileTreeNode) => {
    if (!addressBarRef.current) return;
    setFileNode(node);
    addressBarRef.current.value = node.path;
  };

  function calculateStringSize(input: string) {
    const byteSize = new TextEncoder().encode(input).length;

    const units = ["bytes", "KB", "MB", "GB"];
    let size = byteSize;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    const formattedSize = size % 1 === 0 ? size.toFixed(0) : size.toFixed(2);
    return `${formattedSize} ${units[unitIndex]}`;
  }

  const pasteFile = async () => {
    const clipboardContent = await api.clipboard.readText();
    const file = fileSystem.getNodeByPath(clipboardContent);

    if (file && fileNode) {
      // console.log(file);
      // selectedFileaddChild(selectedFile, file);
      // const newFile = fileSystem.createFileNode(
      //   file.name,
      //   file.isDirectory,
      //   selectedFile.parent,
      // );
      // newFile.content = file.content;
      fileSystem.copyNode(clipboardContent, fileNode.path);

      // console.log(newFile);
      // selectedFile?.children.push;
      updateFileSystem();
    }
  };

  return (
    <Wrapper>
      <WrapperActions>
        <TopBarActions actions={topBarActions} />
        <FileActions>
          <Divider style={{ margin: "2px", alignSelf: "stretch" }} />
          <ToolbarAction
            iconKey="go-previous"
            title="Back"
            actions={[{ title: "Lala", onAction: NOOP }]}
          />
          <ToolbarAction
            iconKey="go-next"
            title="Forward"
            actions={[{ title: "Lala", onAction: NOOP }]}
          />
          <ToolbarAction iconKey="directory_explorer" title="Up" />
          <LongDivider style={{ height: "36px" }} />
          <ToolbarAction iconKey="edit-cut" title="Cut" />
          <ToolbarAction
            iconKey="edit-copy"
            title="Copy"
            onClick={async () => {
              if (selectedFile) {
                await api.clipboard.writeText(selectedFile.path);
              }
            }}
          />
          <ToolbarAction
            iconKey="edit-paste"
            title="Paste"
            onClick={pasteFile}
          />
          <LongDivider style={{ height: "36px" }} />
          <ToolbarAction iconKey="edit-undo" title="Undo" />
          <LongDivider style={{ height: "36px" }} />
          <ToolbarAction
            iconKey="edit-delete"
            title="Delete"
            onClick={() => {
              if (selectedFile) {
                fileSystem.removeNode(selectedFile.path);
                updateFileSystem();
              }
            }}
          />
          <ToolbarAction iconKey="document-properties" title="Properties" />
          <LongDivider style={{ height: "36px" }} />
          <ToolbarAction
            iconKey="view-list"
            title="Views"
            actions={[{ title: "Lala", onAction: NOOP }]}
          />
        </FileActions>

        <AddressBar>
          <Divider style={{ margin: "2px", alignSelf: "stretch" }} />
          <span className="p-1">Address</span>
          <InnerWrapper className="flex">
            {fileNode && <img src={IconResolver.resolve(fileNode).small} />}
            <FileAddress>
              <InputAddress
                ref={addressBarRef}
                type={"text"}
                className="flex-grow"
                defaultValue={"C:/"}
                onFocus={() => setShowList(true)}
                onChange={() => {
                  if (addressBarRef.current) {
                    setSuggestedFileNode(
                      fileSystem.searchNodes(addressBarRef.current.value),
                    );

                    setShowList(true);
                  }
                }}
              />
              {showList &&
                !!suggestedFileNode.filter((v) => v.isDirectory).length && (
                  <FileAddressList ref={addressListRef}>
                    {suggestedFileNode
                      ?.filter((v) => v.isDirectory)
                      .map((v) => (
                        <FileAddressItem
                          key={v.id}
                          onClick={() => {
                            setFileNode(v);

                            addressBarRef.current!.value =
                              changeLastPathSegment(
                                addressBarRef.current!.value,
                                v.name,
                              );

                            if (v.isDirectory)
                              addressBarRef.current!.value += "/";

                            setSuggestedFileNode(
                              fileSystem.searchNodes(
                                addressBarRef.current!.value,
                              ),
                            );

                            setShowList(false);
                          }}
                        >
                          {v.name}
                        </FileAddressItem>
                      ))}
                  </FileAddressList>
                )}
            </FileAddress>
            <DefaultButton className="!p-0">
              <IconSize iconKey="pan-down-symbolic" size="small" />
            </DefaultButton>
          </InnerWrapper>
        </AddressBar>
      </WrapperActions>

      <Body>
        {explorerBar === "folders" && (
          <SidebarNavigation
            onCloseSidebar={closeExplorerBar}
            onSelectPath={onSelectPathSidebar}
          />
        )}

        <InnerWrapper className="flex flex-col gap-[2px]">
          {fileNode?.children.length ? (
            fileNode?.children.map((v) => (
              <FileItem
                src={IconResolver.resolve(v).small}
                key={v.id}
                active={highlightedFile === v.id}
                onClick={(e) => {
                  setHighlightedFile(v.id);
                  setSelectedFile(v);
                }}
                onDoubleClick={() => {
                  if (v.isDirectory) {
                    setFileNode(v);
                    if (addressBarRef.current)
                      addressBarRef.current.value = v.path;
                    return;
                  }

                  const fp = new FileProcessor(v);
                  fp.read();

                  fp.run();
                }}
              >
                <div className="shrink-0">
                  <img src={IconResolver.resolve(v).small} />
                </div>
                <span>
                  {FileProcessor.getFileName(v.name, {
                    excludeExtensions: ["lnk"],
                  })}
                </span>
              </FileItem>
            ))
          ) : fileNode?.content ? (
            <p>{fileNode.content}</p>
          ) : (
            <p>
              Type the name of a program, folder, document, or Internet
              resource, and Windows will open it for you.
            </p>
          )}
        </InnerWrapper>
      </Body>
      <Footer>
        <FooterBox>
          {fileNode?.children?.length
            ? `${fileNode.children?.length} object(s)`
            : ""}
        </FooterBox>
        <FooterBox>
          {!fileNode?.isDirectory ? calculateStringSize(fileNode?.content) : ""}
        </FooterBox>
        <FooterBox>{fileNode?.name}</FooterBox>
      </Footer>
    </Wrapper>
  );
};

const FooterBox = styled.div`
  flex-grow: 1;
  border: 2px inset #fff;
  box-shadow: -1px -1px #000;
  padding: 2px;
  min-height: 21px;
`;

const Footer = styled.div`
  display: flex;
  width: 100%;
  gap: 4px;
  padding-top: 4px;
  padding-bottom: 0px;
`;

const Body = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 4px;
  flex: 1;
  overflow: hidden;
`;

const FileAddressItem = styled.div`
  padding-inline: 4px;

  &:hover {
    background: ${({ theme }) => theme.windowTopBarBackgroundPrimary};
    color: #fff;
  }
`;

const FileAddress = styled.div`
  position: relative;
  margin-left: 4px;
  flex-grow: 1;
`;
const FileAddressList = styled.div`
  width: 100%;
  position: absolute;
  background: #fff;
  border: 1px solid #000;
  z-index: 1;
`;

const InputAddress = styled.input`
  border: none;
  background: white;
  height: 100%;
  width: 100%;
  outline: none;
`;

const InnerWrapper = styled.div`
  box-shadow: ${({ theme }) => theme.insetPixelatedBorder};
  width: 100%;
  padding: 2px;
  height: 100%;
  background: #fff;
`;

const AddressBar = styled.div`
  padding-top: 3px;
  padding-right: 1px;
  padding-bottom: 1px;
  height: 25px;
  display: flex;
  align-items: center;
  border-top: ${themeStyles.baseBorderWhite};
  box-shadow: ${themeStyles.baseBorderShadowThin};
`;

const FileActions = styled.div`
  overflow: auto;
  border-top: ${themeStyles.baseBorderWhite};
  box-shadow: ${themeStyles.baseBorderShadowThin};
  display: flex;
  align-items: center;
  padding: 4px 0;
`;

const WrapperActions = styled.div`
  box-shadow: ${themeStyles.baseBorderShadowWhite};
  border: ${themeStyles.baseBorderThin};
`;

const Wrapper = styled.div`
  margin-top: 1px;
  display: flex;
  font-size: 12px;
  height: 100%;
  flex-direction: column;
  /* gap: 16px; */
  /* padding: 2px; */
`;

const ToolbarActionWrapper = styled.div`
  display: flex;
  align-items: stretch;

  &:hover > div,
  &:hover > button {
    background: ${({ theme }) => theme.elementDefaultBackground};
    box-shadow: ${({ theme }) => theme.buttonPixelatedBorder};
  }

  & > div {
    // border: 1px solid transparent;
  }
`;

const ToolbarButton = styled.button`
  min-width: 52px;
  height: 40px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
  padding: 0 4px;
  // border: 1px solid transparent;

  &:hover img {
    filter: grayscale(0%);
  }
`;

const ToolbarButtonIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    filter: grayscale(100%);
  }
`;
