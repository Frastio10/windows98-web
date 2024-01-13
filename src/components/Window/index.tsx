import { FC, ComponentType, useRef, memo, useMemo } from "react";
import styled from "styled-components";
import { getApp } from "../../configs";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import { useWindowState } from "../../hooks/zustand/useWindowState";
import { NOOP } from "../../utils";
import { TopBar } from "./TopBar";
// import Draggable from 'react-draggable'
import { Rnd } from "react-rnd";
import { AppName, WindowData } from "../../types";
import {
  DEFAULT_WINDOW_HEIGHT,
  DEFAULT_WINDOW_WIDTH,
} from "../../configs/constants";

interface WindowProps {
  windowData: WindowData;
}

const getComponentByName = (name: AppName) => {
  return getApp(name)?.component;
};

export const Window: FC<WindowProps> = ({ windowData }) => {
  const { closeWindowById, setWindowPos, changeFocus, activeWindows } =
    useWindowState();

  const windowRef = useRef<HTMLDivElement>(null);
  const rndRef = useRef<Rnd | null>(null);
  const windowInstance = activeWindows.find(
    (v) => v.windowId === windowData.windowId,
  );
  // useOutsideAlerter(windowRef, () => changeFocus("nofocus"));

  const appConfig = getApp(windowData.appName);

  const Component = getComponentByName(windowData.appName);

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
      return {
        x: windowInstance.pos.x,
        y: windowInstance.pos.y,
      };
    }

    if (appConfig?.defaultPosition === "center") {
      return {
        x: Math.round(
          window.innerWidth / 2 -
            (appConfig?.width || DEFAULT_WINDOW_WIDTH) / 2,
        ),
        y: Math.round(
          window.innerHeight / 2 -
            (appConfig?.height || DEFAULT_WINDOW_HEIGHT) / 2,
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

  return (
    <Rnd
      ref={(c) => {
        if (c) rndRef.current = c;
      }}
      dragHandleClassName="top-bar"
      enableResizing={appConfig?.isResizable ? resizeConfig : false}
      disableDragging={!appConfig?.isDraggable}
      bounds=".bounds"
      default={{
        ...windowPosition,
        width: (appConfig?.width || DEFAULT_WINDOW_WIDTH) + "px",
        height: (appConfig?.height || DEFAULT_WINDOW_HEIGHT) + "px",
      }}
      style={{
        zIndex: activeWindows.find(
          (win) => win.windowId === windowData.windowId,
        )?.z,
      }}
      onDragStart={(event) => {
        changeFocus(windowData.windowId);
      }}
      minWidth={appConfig.width}
      minHeight={appConfig.height}
      onResizeStart={() => changeFocus(windowData.windowId)}
      onDragStop={(_, d) => {
        if (rndRef.current?.resizableElement.current) {
          rndRef.current.resizableElement.current.style.transform = `translate(${Math.round(
            d.x,
          )}px, ${Math.round(d.y)}px)`;
        }

        setWindowPos(windowData.windowId, { x: d.lastX, y: d.lastY });
      }}
    >
      <WindowWrapper
        ref={windowRef}
        onClick={() => changeFocus(windowData.windowId)}
      >
        <TopBar
          windowId={windowData.windowId}
          name={windowData.appName}
          useDefaultExtraActions={appConfig?.useDefaultExtraActions || false}
          title={windowData.title}
          handleClose={() => closeWindowById(windowData.windowId)}
          handleMinimize={NOOP}
          handleFullScreen={NOOP}
        />
        <WindowContentWrapper>
          {Component && <Component windowData={windowData} />}
        </WindowContentWrapper>
      </WindowWrapper>
    </Rnd>
  );
};

const WindowContentWrapper = styled.div`
  flex-grow: 1;
`;

const WindowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: ${({ theme }) => theme.windowPixelatedBorder};
  background: ${({ theme }) => theme.elementDefaultBackground};
  padding: 4px;
`;
