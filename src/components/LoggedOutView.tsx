import { useEffect } from "react";
import styled from "styled-components";
import { useWindowState } from "../hooks/zustand/useWindowState";
import { Window } from "./Window";

export const LoggedOutView = () => {
  const { activeWindows, openWindow } = useWindowState()

  useEffect(() => {
    if (!activeWindows.length) {
      openWindow('logInForm')
    }
  }, [activeWindows])

  return (
    <Wrapper>
      {
        activeWindows.map((w, i) => (
          <Window key={i} windowId={w.windowId} name={w.name} />
        ))
      }
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #007380;
  height: 100%;
`;
