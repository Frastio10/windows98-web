import styled from "styled-components";
import { QUICK_LAUNCH_LIST, getApp } from "../../configs";
import { useWindowState } from "../../hooks/zustand/useWindowState";
import { LongDivider, ThickDivider } from "../shared/Dividers";
import { AppName } from "../../types";

export const QuickLaunch = () => {
  const { openWindow } = useWindowState();
  return (
    <Wrapper>
      <InnerWrapper>
        <ThickDivider />
        <Items>
          {QUICK_LAUNCH_LIST.map((v, i) => (
            <img
              key={i}
              onClick={() => openWindow(v.appName as AppName)}
              height="14"
              width="14"
              src={getApp(v.appName as AppName)?.icons[0]}
              alt={getApp(v.appName as AppName)?.appTitle}
            />
          ))}
        </Items>
        <ThickDivider />
      </InnerWrapper>
      <LongDivider />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  margin: 0 4px;
`;

const InnerWrapper = styled.div`
  margin: 0 3px;
  display: flex;
  align-items: center;
`;

const Items = styled.div`
  padding: 0 5px;
  display: flex;
  align-items: center;
  gap: 6px;
`;
