import { useLayoutEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useFileSystem, useWindow } from "../../../hooks/os";
import { FileNode } from "../../../libs/fileSystem";
import { AppProps, FilePath } from "../../../types";
import { iconSize, NOOP } from "../../../utils";
import { themeStyles } from "../../shared/theme";
import { DefaultButton } from "../../shared/Button";
import { Select } from "../../shared/Select";
import { BaseInput } from "../../shared/Input";
import System from "../../../libs/system";
import { FileDialogResult, FileType } from "../../../types/fileDialogs";
import { DialogResult, MessageBoxButtons } from "../MessageBox";
import FileList from "./FileList";

const defaultFileTypes = [{ key: "all", title: "All Files (*.*)", ext: null }];

export interface FileDialogProps {
  initialPath?: string;
  onResult: (e: FileDialogResult) => void;

  defaultFileType?: FileType;
  fileTypes?: FileType[];

  defaultFileName?: string;

  windowTitle: string;
  actionLabel: string;

  fileNameLabel: string;
  fileTypesLabel: string;

  isMultiple?: boolean;
  isFileOnly: boolean;

  overwritePrompt?: boolean;
  notFoundPrompt?: boolean;

  buttonConfirmLabel?: string;
}

export function FileDialog({ windowData }: AppProps<FileDialogProps>) {
  const { fileSystem } = useFileSystem();
  const { changeFocus, closeWindowById, changeWindowTitle } = useWindow();
  const addressBarRef = useRef<HTMLInputElement>(null);
  const fileNameRef = useRef<HTMLInputElement>(null);

  const isMultiple =
    windowData.args?.isMultiple !== undefined
      ? windowData.args.isMultiple
      : false;

  const fileTypes = [
    ...(windowData.args?.fileTypes || []),
    ...defaultFileTypes,
  ];

  const [selectedFileType, setSelectedFileType] = useState<FileType>(
    windowData.args?.defaultFileType || fileTypes[0],
  );

  const [parentFolder, setParentFolder] = useState<FileNode>(
    fileSystem.searchNodeByPath(
      windowData.args?.initialPath || "C:/WINDOWS/Desktop",
    )!,
  );

  const [selectedFileNodes, setSelectedFileNodes] = useState<FileNode[]>([]);

  function changeLastPathSegment(path: string, newSegment: string) {
    const pathSegments = path.split("/");
    if (pathSegments.length > 1) {
      pathSegments[pathSegments.length - 1] = newSegment;
    }
    return pathSegments.join("/");
  }

  function getFileExtension(fileName: string) {
    const parts = fileName.split(".");
    return parts.length > 1 ? `.${parts.pop()}` : null;
  }

  const handleSaveFile = () => {
    try {
      if (!fileNameRef.current) return;

      const fileName = fileNameRef.current.value;
      const extension = getFileExtension(fileName);

      // If no extension exists, append the default one
      const fullFileName =
        fileName + (extension ? "" : selectedFileType.ext || "");

      const filePath = `${parentFolder.path}/${fullFileName}`;

      const fileExist = fileSystem.getNodeByPath(filePath);
      if (!fileExist && windowData.args?.notFoundPrompt) {
        return System.messageBox(windowData.windowId, {
          title: windowData.args?.windowTitle,
          description: `${filePath} File not found. \n Please verify the correct file name was given.`,
          showWarningIcon: true,
          width: 300,
          height: 130,
          cb: (r) => {
            if (r.windowData.attachedTo) changeFocus(r.windowData.attachedTo);
            closeWindowById(r.windowData.windowId);
          },
        });
      }

      if (fileExist && windowData.args?.overwritePrompt) {
        return System.messageBox(windowData.windowId, {
          title: windowData.args?.windowTitle,
          description: `${filePath} already exists. Do you want to replace it?`,
          buttons: MessageBoxButtons.OKCancel,
          width: 380,
          height: 120,
          cb: (r) => {
            if (r.result === DialogResult.OK) {
              windowData.args?.onResult({
                filePaths: [filePath],
                status: DialogResult.OK,
              });

              if (windowData.attachedTo) changeFocus(windowData.attachedTo);
              System.closeWindow(windowData.windowId);

              changeFocus(r.windowData.attachedTo!);
              return closeWindowById(r.windowData.windowId);
            } else if (r.result === DialogResult.Cancel) {
              changeFocus(r.windowData.attachedTo!);
              return closeWindowById(r.windowData.windowId);
            }
          },
        });
      }

      windowData.args?.onResult({
        filePaths: [filePath],
        status: DialogResult.OK,
      });

      if (windowData.attachedTo) changeFocus(windowData.attachedTo);
      System.closeWindow(windowData.windowId);
    } catch (err) {
      System.messageBox(windowData.windowId, {
        title: windowData.args?.windowTitle,
        description: `${(err as Error).message}`,
        width: 400,
        height: 100,
        cb: (r) => {
          closeWindowById(r.windowData.windowId);
        },
      });
    }
  };

  useLayoutEffect(() => {
    if (windowData.args) {
      changeWindowTitle(windowData.windowId, windowData.args.windowTitle);
    }
  }, []);

  const parentFolderChildren = useMemo(() => {
    const children = parentFolder.children;
    const childrenExt = children.filter((child) => {
      if (!selectedFileType.ext) return child;
      if (!child.isDirectory) return child.name.includes(selectedFileType.ext);
      else return child;
    });

    return childrenExt;
  }, [parentFolder, selectedFileType]);

  const getIcon = (file: FileNode) => {
    const ext = file.name.split(".").pop()!;
    const settings = fileSystem.getStoredSettings();
    const storedIcon = settings.desktop?.iconsSrc?.[ext];

    return storedIcon?.[2];
  };

  return (
    <Wrapper>
      <WrapperActions>
        <AddressBar>
          <span className="p-1 whitespace-nowrap">
            {windowData.args?.actionLabel}:
          </span>
          <Select
            ref={addressBarRef}
            isSelectOnly={true}
            defaultValue={parentFolder.name}
            value={parentFolder.name}
            list={parentFolder.children
              .filter((v) => v.isDirectory)
              .map((v) => ({
                key: v.id,
                title: v.name,
              }))}
            // noop for now, since the original win98 doesnt really allow to write paths on filedialogs addressbar
            onSearch={NOOP}
            onSelect={(e) => {
              const fileNode = parentFolder.children.find(
                (v) => v.id === e.key,
              );

              if (!fileNode) return;

              setParentFolder(fileNode);

              addressBarRef.current!.value = changeLastPathSegment(
                addressBarRef.current!.value,
                fileNode?.name,
              );

              if (fileNode.isDirectory) addressBarRef.current!.value += "/";
            }}
          />
          <ToolsWrapper>
            <DefaultButton
              onClick={() => {
                if (addressBarRef.current) {
                  setParentFolder(fileSystem.searchNodeByPath("C:/WINDOWS")!);
                }
              }}
            >
              <img src={iconSize("go_desktop", "small")} />
            </DefaultButton>
            <DefaultButton>
              <img src={iconSize("go_desktop", "small")} />
            </DefaultButton>
            <DefaultButton>
              <img src={iconSize("go_desktop", "small")} />
            </DefaultButton>
            <DefaultButton>
              <img src={iconSize("go_desktop", "small")} />
            </DefaultButton>
          </ToolsWrapper>
        </AddressBar>
      </WrapperActions>

      <FileList
        isFileOnly={windowData.args!.isFileOnly}
        files={parentFolderChildren}
        onClickFile={(files) => {
          const file = files[0]; // support single selection only
          if (!fileNameRef.current) return;

          if (windowData.args?.isFileOnly) {
            if (file.isDirectory) return;

            fileNameRef.current.value = file.name;
          }

          fileNameRef.current.value = file.name;
        }}
        onDoubleClickFile={(file) => {
          if (file.isDirectory && windowData.args?.isFileOnly) {
            setParentFolder(file);
          }
        }}
      />

      <FooterWrapper>
        <FooterRow className="mb-2">
          <span className="whitespace-nowrap w-16 flex-shrink-0">
            {windowData.args?.fileNameLabel}:
          </span>
          <InnerWrapper>
            <BaseInput
              ref={fileNameRef}
              className="!h-4"
              defaultValue={windowData.args?.defaultFileName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveFile();
                }
              }}
            />
          </InnerWrapper>
          <DefaultButton
            className="w-20 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              handleSaveFile();
            }}
          >
            {windowData.args?.buttonConfirmLabel ?? "Ok"}
          </DefaultButton>
        </FooterRow>
        <FooterRow>
          <span className="whitespace-nowrap w-16 flex-shrink-0">
            {windowData.args?.fileTypesLabel}:
          </span>
          <Select
            isSelectOnly={true}
            parentClass="!h-[20px]"
            onSelect={(e) => {
              const filetype = fileTypes.find((v) => e.key === v.key);
              if (filetype) setSelectedFileType(filetype);
            }}
            list={fileTypes}
            value={selectedFileType.title}
            onSearch={NOOP}
          />
          <DefaultButton
            className="w-20 flex-shrink-0"
            onClick={() => {
              if (windowData.attachedTo) changeFocus(windowData.attachedTo);
              System.closeWindow(windowData.windowId);
            }}
          >
            Cancel
          </DefaultButton>
        </FooterRow>
      </FooterWrapper>
    </Wrapper>
  );
}

// const InputWrapper = styled.div`
//   box-shadow: ${({ theme }) => theme.insetPixelatedBorder};
//   width: 100%;
//   padding: 2px;
//   height: 100%;
//   background: #fff;
// `;
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

const FooterRow = styled.div`
  display: flex;
  whitespace: nowrap;
  align-items: center;
  gap: 12px;
`;

const FooterWrapper = styled.div`
  padding: 8px 0;
`;

const InnerWrapper = styled.div`
  box-shadow: ${({ theme }) => theme.insetPixelatedBorder};
  width: 100%;
  padding: 2px;
  height: 100%;
  background: #fff;
`;

const AddressBar = styled.div`
  padding: 4px 1px;
  height: 32px;
  display: flex;
  align-items: center;
`;

const WrapperActions = styled.div`
  max-width: 492px;
  // box-shadow: ${themeStyles.baseBorderShadowWhite};
  // border: ${themeStyles.baseBorderThin};
`;

const Wrapper = styled.div`
  margin-top: 1px;
  display: flex;
  font-size: 12px;
  height: 100%;
  flex-direction: column;
  padding: 0 8px 8px 8px;
`;

const ToolsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-shrink: 0;
  margin-inline: 6px;
  justify-content: center;
  font-size: 12px;
  gap: 6px;

  button {
    flex-shrink: 0;
  }
`;
