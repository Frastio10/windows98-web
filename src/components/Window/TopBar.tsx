import { ComponentType, useRef, useState } from "react";
import styled from "styled-components";
import { DefaultButton } from "../shared/Button";
import { App, AppName } from "../../types";

interface TopBarProps {
  title: string;
  windowId: string;
  name: string;
  app: App;
  extraActions?: ComponentType<any>[];
  useDefaultExtraActions: boolean;
  isFocused?: boolean;
  handleClose: (args: unknown) => void;
  handleMinimize: (args: unknown) => void;
  handleFullScreen: (isFullScreen: boolean) => void;
}

const CloseButton = ({ ...props }: any) => {
  return (
    <DefaultButton {...props}>
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
    </DefaultButton>
  );
};

const FullScreenButton = ({ ...props }: any) => (
  <DefaultButton {...props}>
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0H0V9H9V0ZM8 2H1V8H8V2Z"
        fill="black"
      />
    </svg>
  </DefaultButton>
);

const MinimizeButton = ({ ...props }: any) => (
  <DefaultButton {...props}>
    <svg
      width="6"
      height="2"
      viewBox="0 0 6 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="6" height="2" fill="black" />
    </svg>
  </DefaultButton>
);

const RestoreButton = ({ ...props }: any) => (
  <DefaultButton {...props}>
    <svg
      width="8"
      height="9"
      viewBox="0 0 8 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="3.5" width="5" height="5" stroke="black" />
      <line x1="1" y1="4.5" x2="5" y2="4.5" stroke="black" />
      <mask id="path-3-inside-1_1154_1058" fill="white">
        <path d="M2 0H8V6H2V0Z" />
      </mask>
      <path
        d="M8 0H9V-1H8V0ZM2 1H8V-1H2V1ZM7 0V6H9V0H7Z"
        fill="black"
        mask="url(#path-3-inside-1_1154_1058)"
      />
      <line x1="3" y1="1.5" x2="7" y2="1.5" stroke="black" />
      <line x1="7" y1="5.5" x2="5" y2="5.5" stroke="black" />
      <line x1="2.5" y1="1" x2="2.5" y2="4" stroke="black" />
    </svg>
  </DefaultButton>
);

export const TopBar = ({
  title,
  useDefaultExtraActions = true,
  windowId,
  name,
  isFocused,
  app,
  extraActions,
  handleClose,
  handleMinimize,
  handleFullScreen,
}: TopBarProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const onChangeFullScreen = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    setIsFullScreen(!isFullScreen);
    handleFullScreen(isFullScreen);
  };

  return (
    <TopBarWrapper className="top-bar">
      <Bar
        onDoubleClick={(ev) => onChangeFullScreen(ev)}
        isFocus={isFocused || false}
      >
        <LeftBar>
          {app?.showTopBarIcon === false ? null : (
            <AppIcon src={app?.icons[0]} />
          )}
          <TextTitle>{title}</TextTitle>
        </LeftBar>
        <Actions>
          {useDefaultExtraActions ? (
            <CloseButton style={{ marginLeft: "2px" }} onClick={handleClose} />
          ) : (
            <>
              <MinimizeButton
                style={{
                  width: "18px",
                  height: "18px",
                  marginLeft: "2px",
                  padding: "4px",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                }}
                onClick={(ev: MouseEvent) => {
                  ev.stopPropagation();
                  handleMinimize(ev);
                }}
              />

              <>
                {isFullScreen ? (
                  <RestoreButton
                    style={{
                      marginLeft: "2px",
                      padding: "4px",
                      width: "18px",
                      height: "18px",
                    }}
                    onClick={onChangeFullScreen}
                  />
                ) : (
                  <FullScreenButton
                    style={{
                      marginLeft: "2px",
                      padding: "4px",
                      width: "18px",
                      height: "18px",
                    }}
                    onClick={onChangeFullScreen}
                  />
                )}
              </>

              <CloseButton
                style={{
                  marginLeft: "2px",
                  padding: "4px",
                  width: "18px",
                  height: "18px",
                }}
                onClick={(ev: MouseEvent) => {
                  ev.stopPropagation();
                  handleClose(ev);
                }}
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
  overflow: hidden;
`;

const LeftBar = styled.div`
  display: flex;
  gap: 4px;
  padding-left: 2px;
  overflow: hidden;
`;

export const Bar = styled.div<{ isFocus: boolean }>`
  max-width: 100%;
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
  white-space: nowrap;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const Actions = styled.div`
  display: flex;
`;
