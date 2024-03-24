import styled from "styled-components";
import { QUICK_LAUNCH_LIST, getApp } from "../../configs";
import { LongDivider, ThickDivider } from "../shared/Dividers";
import { AppName } from "../../types";
import { useWindow } from "../../hooks/os";

export const QuickLaunch = () => {
  const { openWindow } = useWindow();
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
