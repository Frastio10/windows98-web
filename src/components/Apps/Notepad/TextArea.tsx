import React from "react";
import styled from "styled-components";

type NotepadTextAreaProps = {
  defaultValue?: string;
  enableWordWrap?: boolean;
  onSelect?: (ev: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChange?: (ev: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (ev: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

const NotepadTextArea = React.forwardRef<
  HTMLTextAreaElement,
  NotepadTextAreaProps
>(({ defaultValue, enableWordWrap, onSelect, onChange, onKeyDown }, ref) => {
  return (
    <TextArea
      ref={ref}
      defaultValue={defaultValue}
      style={{ whiteSpace: enableWordWrap ? "pre-wrap" : "pre" }}
      onSelect={onSelect}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
});

export default NotepadTextArea;

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-weight: bold;
  resize: none;
  overflow: scroll;
  padding-right: calc(${({ theme }) => theme.scrollbarSize} + 2px);
  padding-bottom: ${({ theme }) => theme.scrollbarSize};
`;
