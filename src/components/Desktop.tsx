import { useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../hooks/os";
import IconResolver from "../libs/iconResolver";
import System from "../libs/system";
import { LoggedInView } from "./LoggedInView";
import { LoggedOutView } from "./LoggedOutView";

export const Desktop = () => {
  const { isLoggedIn } = useAuth();
  const playStartupAudio = async () => {
    const audioManager = System.getInstance().audio();
    await audioManager.loadAudio("/assets/audio/system/startup.mp3");
    audioManager.play();
  };

  useEffect(() => {
    playStartupAudio();
  }, []);

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
