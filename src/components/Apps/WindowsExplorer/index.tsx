import { useRef, useState } from "react";
import styled from "styled-components";
import { useFileSystem } from "../../../hooks/os";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter";
import { FileNode } from "../../../libs/fileSystem";
import { AppProps } from "../../../types";
import { DefaultButton } from "../../shared/Button";
import { Divider, LongDivider } from "../../shared/Dividers";
import { Icon } from "../../shared/icon";
import { themeStyles } from "../../shared/theme";
import { TopBarAction, TopBarActions } from "../../Window/TopBarActions";

const ToolbarAction = () => {
  return (
    <ToolbarButton>
      <ToolbarButtonIcon>
        <Icon index={1} name={"application_hourglass"} />
      </ToolbarButtonIcon>
      Forward
    </ToolbarButton>
  );
};

export const WindowsExplorer = ({ windowData }: AppProps) => {
  const { fileSystem } = useFileSystem();
  const addressBarRef = useRef<HTMLInputElement>(null);
  const addressListRef = useRef<HTMLDivElement>(null);

  const [showList, setShowList] = useState(false);
  const [suggestedFileNode, setSuggestedFileNode] = useState<FileNode[]>([]);
  const [fileNode, setFileNode] = useState<FileNode | null>(null);

  const [highlightedFile, setHighlightedFile] = useState<string | null>(null);

  const topBarActions: TopBarAction[] = [
    {
      title: "File",
      children: [
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
      title: "Search",
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

  useOutsideAlerter([addressListRef], () => {
    setShowList(false);
  });

  return (
    <Wrapper>
      <WrapperActions>
        <TopBarActions actions={topBarActions} />
        <FileActions>
          <Divider style={{ margin: "2px", alignSelf: "stretch" }} />
          <ToolbarAction />
          <ToolbarAction />
          <ToolbarAction />
          <LongDivider style={{ height: "36px" }} />
          <ToolbarAction />
          <ToolbarAction />
          <ToolbarAction />
          <LongDivider style={{ height: "36px" }} />
          <ToolbarAction />
          <LongDivider style={{ height: "36px" }} />
          <ToolbarAction />
          <ToolbarAction />
          <LongDivider style={{ height: "36px" }} />
          <ToolbarAction />
        </FileActions>

        <AddressBar>
          <Divider style={{ margin: "2px", alignSelf: "stretch" }} />
          <span className="p-1">Address</span>
          <InnerWrapper className="flex">
            <img src="/assets/images/medium/application_hourglass_small.png" />
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
              {showList && (
                <FileAddressList ref={addressListRef}>
                  {suggestedFileNode?.map((v) => (
                    <FileAddressItem
                      key={v.id}
                      onClick={() => {
                        setFileNode(v);

                        addressBarRef.current!.value = changeLastPathSegment(
                          addressBarRef.current!.value,
                          v.name,
                        );

                        if (v.isDirectory) addressBarRef.current!.value += "/";

                        setSuggestedFileNode(
                          fileSystem.searchNodes(addressBarRef.current!.value),
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
            <DefaultButton>A</DefaultButton>
          </InnerWrapper>
        </AddressBar>
      </WrapperActions>
      {/* <div */}
      {/*   style={{ */}
      {/*     display: "flex", */}
      {/*     justifyContent: "center", */}
      {/*     alignItems: "flex-start", */}
      {/*   }} */}
      {/* > */}
      {/*   <img src="/assets/images/icons/ico/application_hourglass-0.ico" /> */}
      {/* </div> */}
      <InnerWrapper>
        {fileNode?.children.length ? (
          fileNode?.children.map((v) => (
            <div
              key={v.id}
              style={{ background: highlightedFile === v.id ? "blue" : "" }}
              onClick={(e) => setHighlightedFile(v.id)}
              onDoubleClick={(e) => setFileNode(v)}
            >
              {v.name}
            </div>
          ))
        ) : fileNode?.content ? (
          <p>{fileNode.content}</p>
        ) : (
          <p>
            Type the name of a program, folder, document, or Internet resource,
            and Windows will open it for you.
          </p>
        )}
      </InnerWrapper>
    </Wrapper>
  );
};

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
  border-top: ${themeStyles.baseBorderWhite};
  box-shadow: ${themeStyles.baseBorderShadowThin};
  display: flex;
  align-items: center;
  padding: 2px 0;
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

const ToolbarButton = styled.button`
  width: 52px;
  height: 40px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
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

  &:hover img {
    filter: grayscale(0%);
  }
`;
