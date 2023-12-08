import { useEffect } from "react";
import styled from "styled-components";
import { useLogin } from "../../hooks/zustand/useAuthState";
import { useSystemState } from "../../hooks/zustand/useSystemState";
import { useWindowState } from "../../hooks/zustand/useWindowState";
import { DefaultButton } from "../shared/Button";

interface AppProps {
  windowId: string;
}

export const ShutDown = ({ windowId }: AppProps) => {
  const { shutDown } = useSystemState();
  const { closeWindowById, closeAllWindows } = useWindowState();
  const { logOut } = useLogin();

  useEffect(() => {
    closeAllWindows()
    shutDown();
    logOut();
    closeWindowById(windowId);
  }, []);

  return <></>;
};
