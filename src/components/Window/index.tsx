import { useRef, useMemo, useState, useEffect } from "react";
import { getApp } from "../../configs";
import { extractCssTranslateProperty } from "../../utils";
import { Rnd } from "react-rnd";
import { AppName, AppProps, WindowData } from "../../types";
import { useWindow } from "../../hooks/os";
import { logger } from "../../libs/logger";
import {
  DEFAULT_WINDOW_HEIGHT,
  DEFAULT_WINDOW_WIDTH,
} from "../../configs/constants";
import { BaseWindow, BaseWindowRef } from "./BaseWindow";

interface WindowProps {
  windowData: WindowData;
}

const getComponentByName = (name: AppName) => {
  return getApp(name)?.component;
};

export const Window = ({ windowData }: WindowProps) => {
  const {
    closeWindowById,
    setWindowPos,
    changeFocus,
    activeWindows,
    minimizeWindow,
  } = useWindow();

  const baseWindowRef = useRef<BaseWindowRef>(null);

  // const rndRef = useRef<Rnd | null>(null);
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

  const appConfig = getApp(windowData.appName as AppName);
  if (!appConfig) logger.log("App not found");

  const Component = getComponentByName(windowData.appName as AppName);

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
    if (!baseWindowRef.current) return;
    updatePreviousDimension();

    if (isFullScreen) return restoreMaximize();

    updateWindowedDimension();
    maximize();
  };

  const updatePreviousDimension = () => {
    const rndRef = baseWindowRef.current?.getRndInstance();
    const element = rndRef?.resizableElement.current!;
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
    const rndRef = baseWindowRef.current?.getRndInstance();
    const element = rndRef?.resizableElement.current!;
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
    const rndRef = baseWindowRef.current?.getRndInstance();
    rndRef?.updateSize({ width: "100%", height: "100%" });
    rndRef?.updatePosition({ x: 0, y: 0 });
  };

  const minimize = () => {
    const rndRef = baseWindowRef.current?.getRndInstance();

    updatePreviousDimension();
    setVisibility(false);
    rndRef?.updatePosition({
      x: -rndRef.resizableElement.current!.clientWidth,
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
    const rndRef = baseWindowRef.current?.getRndInstance();

    enableTransition();
    setVisibility(true, false);
    rndRef?.updateSize({
      width: previousDimension!.width,
      height: previousDimension!.height,
    });
    rndRef?.updatePosition({
      x: previousDimension!.x,
      y: previousDimension!.y,
    });
  };

  const setVisibility = (isVisible: boolean, delayDisplayNone = true) => {
    const rndRef = baseWindowRef.current?.getRndInstance();

    let opacity = "0.2";
    let visibility = "hidden";

    if (isVisible) {
      opacity = "1";
      visibility = "visible";
    }

    // setTimeout(() => {
    // }, 500);
    rndRef!.resizableElement.current!.style.opacity = opacity;
    setTimeout(
      () => {
        rndRef!.resizableElement.current!.style.visibility = visibility;
      },
      delayDisplayNone ? 500 : 0,
    );
  };

  const restoreMaximize = () => {
    const rndRef = baseWindowRef.current?.getRndInstance();

    rndRef?.updateSize({
      width: windowedDimension!.width,
      height: windowedDimension!.height,
    });
    rndRef?.updatePosition({
      x: windowedDimension!.x,
      y: windowedDimension!.y,
    });
  };

  const enableTransition = () => {
    const rndRef = baseWindowRef.current?.getRndInstance();

    const element = rndRef?.resizableElement.current!;
    if (!element) return;

    element.style.transition = "0.5s ease-in all";
    element.style.transitionProperty = "width, height, transform";
  };

  return (
    <BaseWindow
      ref={baseWindowRef}
      windowData={windowData}
      appConfig={appConfig!}
      zIndex={
        activeWindows.find((win) => win.windowId === windowData.windowId)?.z
      }
      defaultWidth={
        windowData.args?.width || appConfig?.width || DEFAULT_WINDOW_WIDTH
      }
      defaultHeight={windowData.args?.height || appConfig?.height}
      defaultX={windowPosition.x}
      defaultY={windowPosition.y}
      onDragStart={() => changeFocus(windowData.windowId)}
      onResizeStart={() => changeFocus(windowData.windowId)}
      onFocus={() => changeFocus(windowData.windowId)}
      onClose={() => closeWindowById(windowData.windowId)}
      onFullScreen={(isFullScreen) => fullScreenOrRestore(isFullScreen)}
      onMinimize={() => minimizeWindow(windowData.windowId)}
      onDragStop={(d) =>
        setWindowPos(windowData.windowId, { x: d.lastX, y: d.lastY })
      }
      component={Component!}
    />
  );
};
