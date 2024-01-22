import { useEffect } from "react";
import { useLogin } from "../../hooks/zustand/useAuthState";
import { useSystemState } from "../../hooks/zustand/useSystemState";
import { useWindowState } from "../../hooks/zustand/useWindowState";
import { AppProps } from "../../types";
import { EmptyComponent } from "../shared/EmptyComponent";

export const DesktopOpener = ({ windowData }: AppProps) => {
  const { shutDown } = useSystemState();
  const { closeWindowById, closeAllWindows } = useWindowState();
  const { logOut } = useLogin();

  useEffect(() => {
    closeAllWindows();
    shutDown();
    logOut();
    closeWindowById(windowData.windowId);
  }, []);

  return <EmptyComponent />;
};
