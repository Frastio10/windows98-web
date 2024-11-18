import { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";
import { TopBar } from "./TopBar";
import { DraggableData, Rnd } from "react-rnd";
import { App, AppProps, WindowData } from "../../types";
import { DraggableEvent } from "react-draggable";

interface WindowProps {
  windowData: WindowData;
  appConfig: App;
  zIndex?: number;

  defaultWidth: number;
  defaultHeight: number;
  defaultX: number;
  defaultY: number;

  onDragStart: (ev: DraggableEvent) => void;
  onDragStop: (d: DraggableData) => void;
  onResizeStart: (ev: React.MouseEvent | React.TouchEvent) => void;
  onFocus: (windowId: string) => void;
  onClose: (windowId: string) => void;
  onFullScreen: (isFullScreen: boolean) => void;
  onMinimize: (windowId: string) => void;

  component: ({ windowData }: AppProps) => JSX.Element;
}

// dont know if its a good idea but it works anyway
export interface BaseWindowRef {
  getWindowInstance: () => HTMLDivElement | null;
  getRndInstance: () => Rnd | null;
}

export const BaseWindow = forwardRef<BaseWindowRef, WindowProps>(
  (
    {
      windowData,
      zIndex,
      appConfig,

      defaultX,
      defaultY,

      defaultWidth,
      defaultHeight,

      onDragStart,
      onDragStop,
      onFocus,
      onClose,
      onFullScreen,
      onResizeStart,
      onMinimize,

      component,
    },
    ref,
  ) => {
    const windowRef = useRef<HTMLDivElement>(null);
    const rndRef = useRef<Rnd | null>(null);

    const Component = component;

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

    const disableTransition = () => {
      if (!rndRef.current || !rndRef.current.resizableElement.current) return;
      rndRef.current.resizableElement.current.style.transition = "none";
    };

    // Expose refs and methods to parent
    useImperativeHandle(ref, () => ({
      getWindowInstance: () => windowRef.current,
      getRndInstance: () => rndRef.current,
    }));

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
          x: defaultX,
          y: defaultY,
          width: defaultWidth + "px",
          height: defaultHeight + "px",
        }}
        style={{
          zIndex,
        }}
        onDragStart={(ev) => {
          disableTransition();
          onDragStart(ev);
        }}
        minWidth={appConfig?.width || 300}
        minHeight={appConfig?.height || 300}
        onResizeStart={(ev) => {
          disableTransition();
          onResizeStart(ev);
        }}
        onDragStop={(_, d) => {
          if (rndRef.current?.resizableElement.current) {
            rndRef.current.resizableElement.current.style.transform = `translate(${Math.round(
              d.x,
            )}px, ${Math.round(d.y)}px)`;
          }

          onDragStop(d);
        }}
      >
        <WindowWrapper
          ref={windowRef}
          onClick={() => onFocus(windowData.windowId)}
        >
          {appConfig && (
            <TopBar
              app={appConfig}
              windowId={windowData.windowId}
              isFocused={windowData.isFocused}
              name={windowData.appName}
              useDefaultExtraActions={
                appConfig?.useDefaultExtraActions || false
              }
              title={windowData.title}
              handleClose={() => onClose(windowData.windowId)}
              handleFullScreen={(isFullScreen) => {
                if (!rndRef.current) return;

                onFullScreen(isFullScreen);
              }}
              handleMinimize={() => {
                onMinimize(windowData.windowId);
              }}
            />
          )}
          <WindowContentWrapper>
            {Component && <Component windowData={windowData} />}
          </WindowContentWrapper>
        </WindowWrapper>
      </Rnd>
    );
  },
);

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
