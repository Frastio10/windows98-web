import { Rnd } from "react-rnd";
import styled from "styled-components";
import { themeStyles } from "../../../shared/theme";
import { CloseButton } from "../../../Window/TopBar";
import FileTree, { FileTreeNode } from "./FileTree";
import FileSystem from "../../../../libs/fileSystem";

const fs = FileSystem.getInstance();

const fileTreeData = [
  {
    name: "Desktop",
    id: "root-destop",
    isRoot: true,
    children: [
      {
        name: "My Computer",
        children: [
          {
            ...fs.getNodeByPath("C:/"),
          },
        ],
      },
      { name: '3.5" Floppy (A:)' },
    ],
  },
] as FileTreeNode[];

interface SidebarNavigationProps {
  onCloseSidebar: () => void;

  onSelectPath?: (node: FileTreeNode) => void;
}
export default function SidebarNavigation({
  onCloseSidebar,
  onSelectPath,
}: SidebarNavigationProps) {
  return (
    <Rnd
      className="relative h-full"
      disableDragging
      enableResizing={{
        right: true,
        left: false,
        top: false,
        bottom: false,
        topLeft: false,
        topRight: false,
        bottomLeft: false,
        bottomRight: false,
      }}
      minWidth={150}
      maxWidth={"40%"}
      style={{ position: "relative" }}
    >
      <Wrapper>
        <SidebarHeader>
          <span>Folders</span>
          <SidebarCloseButton onClick={onCloseSidebar}>
            <svg
              width="8"
              height="7"
              viewBox="0 0 8 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 0H2V1H3V2H5V1H6V0H8V1H7V2H6V3H5V4H6V5H7V6H8V7H6V6H5V5H3V6H2V7H0V6H1V5H2V4H3V3H2V2H1V1H0V0Z"
                fill="black"
              />
            </svg>
          </SidebarCloseButton>
        </SidebarHeader>
        <InnerWrapper>
          <FileTree data={fileTreeData} onSelectPath={onSelectPath} />
        </InnerWrapper>
      </Wrapper>
    </Rnd>
  );
}

const SidebarCloseButton = styled.button``;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 4px 6px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  box-shadow: ${themeStyles.baseBorderShadowWhite};
  border: ${themeStyles.baseBorderThin};
  height: 100%;
`;

const InnerWrapper = styled.div`
  box-shadow: ${({ theme }) => theme.insetPixelatedBorder};
  overflow: auto;
  width: 100%;
  padding: 2px;
  height: 100%;
  background: #fff;
`;
