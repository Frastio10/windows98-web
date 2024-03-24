import {
  FC,
  ComponentType,
  useRef,
  memo,
  useMemo,
  useState,
  useEffect,
} from "react";
import styled from "styled-components";
import { getApp } from "../../configs";
import { extractCssTranslateProperty, NOOP } from "../../utils";
import { TopBar } from "./TopBar";
// import Draggable from 'react-draggable'
import { Rnd } from "react-rnd";
import { AppName, Size, WindowData } from "../../types";
import {
  DEFAULT_WINDOW_HEIGHT,
  DEFAULT_WINDOW_WIDTH,
} from "../../configs/constants";
import { useWindow } from "../../hooks/os";

interface WindowProps {
  windowData: WindowData;
}

const getComponentByName = (name: AppName) => {
  return getApp(name)?.component;
};

export const Window: FC<WindowProps> = ({ windowData }) => {
  const {
    closeWindowById,
    setWindowPos,
    changeFocus,
    activeWindows,
    minimizeWindow,
  } = useWindow();

  const windowRef = useRef<HTMLDivElement>(null);
  const rndRef = useRef<Rnd | null>(null);
  const windowInstance = activeWindows.find(
    (v) => v.windowId === windowData.windowId,
  );

  const [previousDimension, setPreviousDimension] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);

  const [windowedDimension, setWindowedDimension] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);

  const [hasMinimized, setHasMinimized] = useState<boolean>(false);
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

  const fullScreenOrRestore = (isFullScreen: boolean) => {
    if (!rndRef.current) return;
    updatePreviousDimension();

    if (isFullScreen) return restoreMaximize();

    updateWindowedDimension();
    maximize();
  };

  const updatePreviousDimension = () => {
    const element = rndRef.current?.resizableElement.current!;
    if (!element) return;

    enableTransition();

    setPreviousDimension({
      x: extractCssTranslateProperty(element.style.transform).x,
      y: extractCssTranslateProperty(element.style.transform).y,
      width: element.clientWidth,
      height: element.clientHeight,
    });
  };

  const updateWindowedDimension = () => {
    const element = rndRef.current?.resizableElement.current!;
    if (!element) return;

    enableTransition();

    setWindowedDimension({
      x: extractCssTranslateProperty(element.style.transform).x,
      y: extractCssTranslateProperty(element.style.transform).y,
      width: element.clientWidth,
      height: element.clientHeight,
    });
  };

  const maximize = () => {
    rndRef.current?.updateSize({ width: "100%", height: "100%" });
    rndRef.current?.updatePosition({ x: 0, y: 0 });
  };

  const minimize = () => {
    updatePreviousDimension();
    setVisibility(false);
    rndRef.current?.updatePosition({
      x: -rndRef.current.resizableElement.current!.clientWidth,
      y: window.innerHeight,
    });
  };

  useEffect(() => {
    if (windowInstance?.isMinimized) {
      setHasMinimized(true);
      minimize();
    }

    if (!windowInstance?.isMinimized && hasMinimized) {
      restoreToPreviousDimension();
    }
  }, [windowInstance?.isMinimized]);

  const restoreToPreviousDimension = () => {
    enableTransition();
    setVisibility(true, false);
    rndRef.current?.updateSize({
      width: previousDimension!.width,
      height: previousDimension!.height,
    });
    rndRef.current?.updatePosition({
      x: previousDimension!.x,
      y: previousDimension!.y,
    });
  };

  const setVisibility = (isVisible: boolean, delayDisplayNone = true) => {
    let opacity = "0.2";
    let visibility = "hidden";

    if (isVisible) {
      opacity = "1";
      visibility = "visible";
    }

    // setTimeout(() => {
    rndRef.current!.resizableElement.current!.style.opacity = opacity;
    // }, 500);
    setTimeout(
      () => {
        rndRef.current!.resizableElement.current!.style.visibility = visibility;
      },
      delayDisplayNone ? 500 : 0,
    );
  };

  const restoreMaximize = () => {
    rndRef.current?.updateSize({
      width: windowedDimension!.width,
      height: windowedDimension!.height,
    });
    rndRef.current?.updatePosition({
      x: windowedDimension!.x,
      y: windowedDimension!.y,
    });
  };

  const enableTransition = () => {
    const element = rndRef.current?.resizableElement.current!;
    if (!element) return;

    element.style.transition = "0.5s ease-in all";
    element.style.transitionProperty = "width, height, transform";
  };

  const disableTransition = () => {
    if (!rndRef.current || !rndRef.current.resizableElement.current) return;
    rndRef.current.resizableElement.current!.style.transition = "none";
  };

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
      onDragStart={() => {
        changeFocus(windowData.windowId);
        disableTransition();
      }}
      minWidth={appConfig.width}
      minHeight={appConfig.height}
      onResizeStart={() => {
        changeFocus(windowData.windowId);
        disableTransition();
      }}
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
          handleFullScreen={(isFullScreen) => {
            if (!rndRef.current) return;

            fullScreenOrRestore(isFullScreen);
          }}
          handleMinimize={() => {
            minimizeWindow(windowData.windowId);
            changeFocus(null);
          }}
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
