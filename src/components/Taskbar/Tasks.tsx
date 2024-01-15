import { useRef } from "react";
import styled from "styled-components";
import { getApp } from "../../configs";
import { useWindowState } from "../../hooks/zustand/useWindowState";

export const Tasks = () => {
  const { activeWindows, changeFocus } = useWindowState();
  const tasksWrapperRef = useRef<HTMLDivElement>(null);

  const calculateTaskElementWidth = (
    parentWidth: number,
    tasksLength: number,
  ) => {
    const TASK_ELEMENT_WIDTH = 180;
    const width = Math.min(parentWidth / tasksLength, TASK_ELEMENT_WIDTH);
    return width;
  };
  return (
    <Wrapper ref={tasksWrapperRef}>
      {tasksWrapperRef.current ? (
        <Inner>
          {activeWindows.map((v, i) => {
            const app = getApp(v.appName);
            return (
              <Task
                key={v.windowId}
                isFocused={v.isFocused}
                onClick={() => changeFocus(v.windowId)}
                style={{
                  width:
                    calculateTaskElementWidth(
                      tasksWrapperRef.current!.clientWidth,
                      activeWindows.length,
                    ) -
                    3.2 +
                    "px",
                }}
              >
                <img src={app?.icons[0]} />
                <span>{v.title}</span>
              </Task>
            );
          })}
        </Inner>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-right: 5px;
  display: flex;
  align-items: center;
  user-select: none;
`;

const Inner = styled.div`
  height: 80%;
  display: flex;
  align-items: center;
  gap: 3px;
`;

const Task = styled.div<{ isFocused: boolean }>`
  cursor: pointer;
  overflow: hidden;
  border: ${({ isFocused }) =>
    isFocused ? "2px inset #fff" : "2px outset #fff"};

  box-shadow: ${({ isFocused }) =>
    isFocused ? "-1px -1px #000" : "1px 1px #000"};

  font-weight: ${({ isFocused }) => (isFocused ? "700" : "")};

  font-size: 12px;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 2px;

  img {
    width: 14px;
    margin-right: 5px;
  }

  span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
