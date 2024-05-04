import styled from "styled-components";

export const ColoredHoverButton = styled.button`
  border: none;

  &:hover {
    background: ${({ theme }) => theme.windowTopBarBackgroundPrimary};
    color: #fff;
  }
`;

export const HoverButtonInset = styled.button`
  border: none;

  &:hover {
    background: ${({ theme }) => theme.windowTopBarBackgroundPrimary};
    color: #fff;
  }
`;

export const ClearButton = styled.button`
  background: none;
  border: none;
  outline: none;
  display: contents;
  cursor: pointer;
`;

export const DefaultButton = styled.button`
  background: ${({ theme }) => theme.elementDefaultBackground};
  box-shadow: ${({ theme }) => theme.buttonPixelatedBorder};
  border: none;
  outline: none;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
