import { useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../hooks/os";
import IconResolver from "../libs/IconResolver";
import System from "../libs/System";
import { LoggedInView } from "./LoggedInView";
import { LoggedOutView } from "./LoggedOutView";
import packageJson from "../../package.json";

export const Desktop = () => {
  const { isLoggedIn } = useAuth();
  const playStartupAudio = async () => {
    const audioManager = System.getInstance().audio();
    await audioManager.loadAudio("/assets/audio/system/startup.mp3");
    audioManager.play();
  };

  useEffect(() => {
    if (isLoggedIn) playStartupAudio();
  }, [isLoggedIn]);

  return (
    <Wrapper>
      <>{isLoggedIn ? <LoggedInView /> : <LoggedOutView />}</>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
