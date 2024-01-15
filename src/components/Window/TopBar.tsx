import { ComponentType, useRef, useState } from "react";
import styled from "styled-components";
import { useWindowState } from "../../hooks/zustand/useWindowState";
import { DefaultButton } from "../shared/Button";
import { AppName } from "../../types";
import { getApp } from "../../configs";

interface TopBarProps {
  title: string;
  windowId: string;
  name: AppName;
  extraActions?: ComponentType<any>[];
  useDefaultExtraActions: boolean;
  handleClose: (args: unknown) => void;
  handleMinimize: (args: unknown) => void;
  handleFullScreen: (isFullScreen: boolean) => void;
}

const CloseButton = ({ ...props }: any) => {
  return (
    <DefaultButton {...props}>
      <svg
        width="10"
        height="9"
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
    </DefaultButton>
  );
};

export const TopBar = ({
  title,
  useDefaultExtraActions = true,
  windowId,
  name,
  extraActions,
  handleClose,
  handleMinimize,
  handleFullScreen,
}: TopBarProps) => {
  const { activeWindows } = useWindowState();
  const app = getApp(name);
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <TopBarWrapper className="top-bar">
      <Bar
        isFocus={
          activeWindows.find((v) => v.windowId === windowId)?.isFocused || false
        }
      >
        <LeftBar>
          {app.showTopBarIcon === false ? null : <AppIcon src={app.icons[0]} />}
          <TextTitle>{title}</TextTitle>
        </LeftBar>
        <Actions>
          {useDefaultExtraActions ? (
            <CloseButton style={{ marginLeft: "2px" }} onClick={handleClose} />
          ) : (
            <>
              <CloseButton
                style={{ marginLeft: "2px", padding: "4px" }}
                onClick={(ev: MouseEvent)=>{
                    ev.stopPropagation()
                    handleMinimize(ev)
                  }}
              />

              <CloseButton
                style={{ marginLeft: "2px", padding: "4px" }}
                onClick={() => {
                  setIsFullScreen(!isFullScreen);
                  handleFullScreen(isFullScreen);
                }}
              />

              <CloseButton
                style={{ marginLeft: "2px", padding: "4px" }}
                onClick={handleClose}
              />
            </>
          )}
        </Actions>
      </Bar>
    </TopBarWrapper>
  );
};

export const TopBarWrapper = styled.div`
  user-select: none;
`;

const LeftBar = styled.div`
  display: flex;
  gap: 4px;
  padding-left: 2px;
`;

export const Bar = styled.div<{ isFocus: boolean }>`
  background: ${({ theme, isFocus }) =>
    isFocus
      ? theme.windowTopBarBackgroundPrimary
      : theme.windowTopBarBackgroundSecondary};
  padding: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AppIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const TextTitle = styled.p`
  font-weight: bold;
  color: #fff;
  font-size: 13px;
`;

export const Actions = styled.div`
  display: flex;
`;
