import { FC, ComponentType, useRef, memo, useMemo } from "react";
import styled from "styled-components";
import { getApp } from "../../configs";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import { useWindowState } from "../../hooks/zustand/useWindowState";
import { NOOP } from "../../utils";
import { TopBar } from "./TopBar";
// import Draggable from 'react-draggable'
import { Rnd } from "react-rnd";
import { AppName } from "../../types";
import {
  DEFAULT_WINDOW_HEIGHT,
  DEFAULT_WINDOW_WIDTH,
} from "../../configs/constants";

interface WindowProps {
  name: AppName;
  windowId: string;
}

const getComponentByName = (name: AppName) => {
  // const components: {
  //   [K in AppType]: {
  //     defaultTitle: string;
  //     useDefaultExtraActions: boolean;
  //     component: ComponentType<any>;
  //   };
  // } = APPS;,

  return getApp(name)?.component;
};

export const Window: FC<WindowProps> = ({ name, windowId }) => {
  const { closeWindowById, setWindowPos, changeFocus, activeWindows } =
    useWindowState();

  const windowRef = useRef<HTMLDivElement>(null);
  const rndRef = useRef<Rnd | null>(null);
  const windowInstance = activeWindows.find((v) => v.windowId === windowId);
  // useOutsideAlerter(windowRef, () => changeFocus("nofocus"));

  const appConfig = getApp(name);

  const Component = getComponentByName(name);

  const resizeConfig = {
    top: true,
    right: true,
    bottom: true,
    left: true,
    topRight: true,
    bottomRight: true,
    bottomLeft: true,
    topLeft: true,
  };

  const windowPosition = useMemo(() => {
    if (windowInstance?.pos.x && windowInstance.pos.y) {
      console.log("here");
      return {
        x: windowInstance.pos.x,
        y: windowInstance.pos.y,
      };
    }

    if (appConfig?.defaultPosition === "center") {
      return {
        x: Math.round(
          window.innerWidth / 2 - (appConfig?.width || DEFAULT_WINDOW_WIDTH) / 2
        ),
        y: Math.round(
          window.innerHeight / 2 -
            (appConfig?.height || DEFAULT_WINDOW_HEIGHT) / 2
        ),
      };
    }

    const values = appConfig?.defaultPosition?.split(" ").map(Number);
    if (values?.length) {
      return {
        x: values[0],
        y: values[1],
      };
    }

    return {
      x: Math.round(window.innerWidth / 2 - DEFAULT_WINDOW_WIDTH / 2),
      y: Math.round(window.innerHeight / 2 - DEFAULT_WINDOW_HEIGHT / 2),
    };
  }, [name, windowInstance, activeWindows]);

  console.log(windowId, windowInstance?.pos);

  return (
    <Rnd
      ref={(c) => {
        if (c) rndRef.current = c;
      }}
      dragHandleClassName="top-bar"
      enableResizing={appConfig?.isResizable ? resizeConfig : false}
      disableDragging={!appConfig?.isDraggable}
      default={{
        ...windowPosition,
        width: (appConfig?.width || DEFAULT_WINDOW_WIDTH) + "px",
        height: (appConfig?.height || DEFAULT_WINDOW_HEIGHT) + "px",
      }}
      style={{
        zIndex: activeWindows.find((win) => win.windowId === windowId)?.z,
      }}
      onDragStart={() => changeFocus(windowId)}
      onResizeStart={() => changeFocus(windowId)}
      onDragStop={(_, d) => {
        if (rndRef.current?.resizableElement.current) {
          rndRef.current.resizableElement.current.style.transform = `translate(${Math.round(
            d.x
          )}px, ${Math.round(d.y)}px)`;
        }

        setWindowPos(windowId, { x: d.x, y: d.y });
      }}
    >
      <WindowWrapper ref={windowRef} onClick={() => changeFocus(windowId)}>
        <TopBar
          windowId={windowId}
          name={name}
          useDefaultExtraActions={getApp(name)?.useDefaultExtraActions || false}
          title={getApp(name)?.defaultTitle || ""}
          handleClose={() => closeWindowById(windowId)}
          handleMinimize={NOOP}
          handleFullScreen={NOOP}
        />
        {Component && <Component />}
      </WindowWrapper>
    </Rnd>
  );
};

const WindowWrapper = styled.div`
  height: 100%;
  box-shadow: ${({ theme }) => theme.windowPixelatedBorder};
  background: ${({ theme }) => theme.elementDefaultBackground};
  padding: 6px;
`;
