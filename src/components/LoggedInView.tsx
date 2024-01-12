import { useEffect } from "react";
import styled from "styled-components";
import { useWindowState } from "../hooks/zustand/useWindowState";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";

export const LoggedInView = () => {
  const { activeWindows } = useWindowState();
  useEffect(()=> {
    console.log(activeWindows)
  }, [activeWindows])
  return (
    <Wrapper>
      <Main className="bounds">
      {activeWindows.map((w, i) => (
        <Window key={w.windowId} windowData={w} />
      ))}
      </Main>
      <Bottom>
        <Taskbar />
      </Bottom>
    </Wrapper>
  );
};

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

`

const Main = styled.div`
 flex: 1 1 0;
  
`
