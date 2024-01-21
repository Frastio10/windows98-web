import { useEffect } from "react";
import styled from "styled-components";
import { useWindowState } from "../../hooks/zustand/useWindowState";
import { AppProps } from "../../types";
import {
  TopBarAction,
  TopBarActions,
  TopBarActionsProps,
} from "../Window/TopBarActions";

export const Notepad = ({ windowData }: AppProps) => {
  const { changeWindowTitle } = useWindowState();
  const topBarActions: TopBarAction[] = [
    {
      title: "File",
      children: [
        {
          title: "File",
          onAction: () => console.log("pepo"),
        },
        {
          title: "Open...",
          onAction: () => console.log("hellopeppoep"),
        },
        {
          title: "Save",
          onAction: () => console.log("hellopeppoep"),
        },
        {
          title: "Save As",
          shortcutLetter: "A",
          onAction: () => console.log("hellopeppoep"),
        },
      ],
    },
    {
      title: "Edit",
      onAction: () => console.log("hellopeppoep"),
    },
    {
      title: "Search",
      onAction: () => console.log("hellopeppoep"),
    },
    {
      title: "Help",
      onAction: () => console.log("hellopeppoep"),
    },
  ];
  return (
    <Wrapper>
      <TopBarActions actions={topBarActions} />
      <TextAreaWrapper>
        <TextArea
          onChange={(ev) => {
            console.log(JSON.stringify(ev.target.value));
          }}
        ></TextArea>
      </TextAreaWrapper>
    </Wrapper>
  );
};

const TextAreaWrapper = styled.div`
  box-shadow: ${({ theme }) => theme.insetPixelatedBorder};
  width: 100%;
  padding: 2px;
  height: 100%;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  overflow: scroll;
  white-space: pre;
  padding-right: calc(${({ theme }) => theme.scrollbarSize} + 2px);
  padding-bottom: ${({ theme }) => theme.scrollbarSize};
`;

const Wrapper = styled.div`
  display: flex;
  font-size: 12px;
  gap: 2px;
  height: 100%;
  padding: 2px;
  flex-direction: column;
`;
