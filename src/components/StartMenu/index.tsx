import { Children, forwardRef, RefObject, useRef } from "react";
import styled from "styled-components";
import { START_MENU_LIST } from "../../configs";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import { useStartMenu } from "../../hooks/zustand/useStartMenu";
import { useWindowState } from "../../hooks/zustand/useWindowState";
import { App, StartMenuApp } from "./StartMenuApp";
import { AppName } from "../../types";

export const StartMenu = forwardRef<HTMLDivElement>((props, ref) => {
  const {
    isStartMenuOpen,
    changeStartMenuButton,
    changeStartMenu,
    isStartButtonClicked,
  } = useStartMenu();

  return (
    <Wrapper ref={ref}>
      <WindowLogo>
        <p style={{ transform: "rotate(-90deg)", width: "16px" }}>
          Windows<span>98</span>
        </p>
      </WindowLogo>
      <MenuList>
        {START_MENU_LIST.map((v, parentIdx) => {
          return (
            <div key={parentIdx}>
              {v.map((menu, idx) => (
                <StartMenuApp
                  key={idx}
                  appName={menu.appName as AppName}
                  isDisabled={menu.isDisabled}
                  children={menu.children as App[]}
                />
              ))}
              {parentIdx !== START_MENU_LIST.length - 1 && (
                <hr style={{ margin: "2px 0" }} />
              )}
            </div>
          );
        })}
      </MenuList>
    </Wrapper>
  );
});

const MenuList = styled.div`
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  border: 2px outset #fff;
  box-shadow: 1px 1px #000;
  height: 336px;
  background: ${({ theme }) => theme.elementDefaultBackground};
  width: 210px;
  position: absolute;
  bottom: 25px;
  /* Mwahahahah */
  z-index: 9999999999999999999999999999999999999999999999999999999999999;
`;

const WindowLogo = styled.div`
  display: flex;
  background: linear-gradient(#00045f, #010079, blue);
  padding: 2px;
  color: white;
  font-weight: bold;
  align-items: flex-end;

  span {
    font-weight: lighter;
  }
`;
