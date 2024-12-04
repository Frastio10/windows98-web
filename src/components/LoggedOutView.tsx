import { useEffect } from "react";
import styled from "styled-components";
import { useWindow } from "../hooks/os";
import { Window } from "./Window";

export const LoggedOutView = () => {
  const { activeWindows, openWindow } = useWindow();

  useEffect(() => {
    const exists = activeWindows.find((win) => win.appName === "logInForm");
    console.log({ exists });
    if (!exists) {
      console.log(exists);
      openWindow("logInForm");
    }
  }, [activeWindows]);

  return (
    <Wrapper className="bounds">
      {activeWindows.map((w, i) => (
        <Window key={i} windowData={w} />
      ))}
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
