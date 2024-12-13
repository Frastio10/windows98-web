import { useRef } from "react";
import styled from "styled-components";
import { useWindow } from "../../hooks/os";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import { useStartMenu } from "../../hooks/zustand/useStartMenu";
import { DefaultButton } from "./../shared/Button";
import { StartMenu } from "./../StartMenu";
import { Clock } from "./Clock";
import { QuickLaunch } from "./QuickLaunch";
import { Tasks } from "./Tasks";

export const Taskbar = () => {
  const { openWindow } = useWindow();
  const {
    isStartMenuOpen,
    isStartButtonClicked,
    changeStartMenu,
    changeStartMenuButton,
  } = useStartMenu();

  const startMenuRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  useOutsideAlerter([startMenuRef, startButtonRef], () => {
    changeStartMenu(false);
  });

  return (
    <Wrapper>
      {isStartMenuOpen && <StartMenu ref={startMenuRef} />}
      <Main>
        <LeftBar>
          <StartButton
            ref={startButtonRef}
            onClick={() => {
              changeStartMenuButton(!isStartButtonClicked);
              if (isStartMenuOpen && isStartButtonClicked) {
                changeStartMenu(false);
              } else {
                changeStartMenu(true);
              }
            }}
          >
            <img src="/assets/images/win98-logo.png" width={20} />
            <span>Start</span>
          </StartButton>
          <QuickLaunch />
        </LeftBar>
        <Tasks />
        <RightBar>
          <Clock />
        </RightBar>
      </Main>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const StartButton = styled.button`
  border: 2px outset #fff;
  box-shadow: 1px 1px #000;
  padding: 0 0 0 2px;
  display: flex;
  align-items: center;
  height: 21px;
  gap: 4px;
  margin-left: -8px;
  width: 65px;
  font-weight: bold;
  font-size: 12px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.elementDefaultBackground};
`;

const Main = styled.div`
  height: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* box-shadow: ${({ theme }) => theme.windowPixelatedBorder}; */
  border-top: 2px outset #fff;
  padding: 0 8px;
  background: ${({ theme }) => theme.elementDefaultBackground};
`;

const LeftBar = styled.div`
  display: flex;
`;

const RightBar = styled.div``;
