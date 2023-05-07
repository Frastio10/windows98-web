import styled from "styled-components";
import { useWindowState } from "../hooks/zustand/useWindowState";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window"

export const LoggedInView = () => {
  const { activeWindows } = useWindowState()
  return (
    <Wrapper>
      {
        activeWindows.map((w, i) => (
          <Window key={i} windowId={w.windowId} name={w.name} />
        ))
      }
      <Taskbar />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: ${({ theme }) => theme.defaultBackground};
  height: 100%;
  width: 100%;
  position: relative;
`
