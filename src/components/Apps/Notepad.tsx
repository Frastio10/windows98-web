import styled from "styled-components";
import { useWindowState } from "../../hooks/zustand/useWindowState";
import { AppProps } from "../../types";
import { DefaultButton } from "../shared/Button";

export const Notepad = ({ windowData }: AppProps) => {
  return (
    <Wrapper>
      <TextArea></TextArea>
    </Wrapper>
  );
};

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  overflow: scroll;
  white-space: pre;
  box-shadow: ${({ theme }) => theme.insetPixelatedBorder};
  padding-right: calc(${({ theme }) => theme.scrollbarSize} + 2px);
  padding-bottom: ${({ theme }) => theme.scrollbarSize};
`;

const Wrapper = styled.div`
  display: flex;
  font-size: 12px;
  gap: 16px;
  height: 100%;
  padding: 8px;
`;
