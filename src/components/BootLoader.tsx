import React from "react";
import { useSystemState } from "../hooks/zustand/useSystemState";
import { ShutDown } from "./Screens/ShutDown";
import { Desktop } from "./Desktop";

export const BootLoader = (props: {}) => {
  const { isShutDown } = useSystemState();
  return isShutDown ? <ShutDown /> : <Desktop />;
};
