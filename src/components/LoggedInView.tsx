import { useEffect, useState } from "react";
import styled from "styled-components";
import { useWindowState } from "../hooks/zustand/useWindowState";
import { Vector2D } from "../types";
import { Box } from "./shared/Box";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";

export const LoggedInView = () => {
  const { activeWindows } = useWindowState();
  const [shortcutBoxCoordinate, setShortcutBoxCoordinate] =
    useState<Vector2D | null>(null);

  const hideShortcutBox = () => {
    setShortcutBoxCoordinate(null);
  };

  document.addEventListener("click", hideShortcutBox);
  document.addEventListener("keydown", hideShortcutBox);

  return (
    <Wrapper>
      <Main className="bounds">
        <EventHandlerOverlay
          onContextMenu={(ev) => {
            setShortcutBoxCoordinate({ x: ev.clientX, y: ev.clientY });
          }}
        />
        {activeWindows.map((w, i) => (
          <Window key={w.windowId} windowData={w} />
        ))}

        {shortcutBoxCoordinate && (
          <Box
            style={{
              top: shortcutBoxCoordinate.y,
              left: shortcutBoxCoordinate.x,
              position: "absolute",
              width: "300px",
            }}
          >Window</Box>
        )}
      </Main>
      <Bottom>
        <Taskbar />
      </Bottom>
    </Wrapper>
  );
};

const EventHandlerOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  background: ${({ theme }) => theme.defaultBackground};
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Bottom = styled.div`
  position: relative;
  height: 25px;
`;

const Main = styled.div`
  flex: 1 1 0;
  position: relative;
`;
