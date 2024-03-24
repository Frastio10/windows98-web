import { useEffect } from "react";
import { useAuth, useSystem, useWindow } from "../../hooks/os";
import { AppProps } from "../../types";
import { EmptyComponent } from "../shared/EmptyComponent";

export const DesktopOpener = ({ windowData }: AppProps) => {
  const { shutDown } = useSystem();
  const { closeWindowById, closeAllWindows } = useWindow();
  const { logOut } = useAuth();

  useEffect(() => {
    closeAllWindows();
    shutDown();
    logOut();
    closeWindowById(windowData.windowId);
  }, []);

  return <EmptyComponent />;
};
