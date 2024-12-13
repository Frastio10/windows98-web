import React from "react";
import styled from "styled-components";
import { useSystem } from "../../hooks/os";

export const ShutDown = (props: {}) => {
  const { turnOn } = useSystem();
  return (
    <Wrapper>
      <Text onClick={turnOn}>You can just refresh to go back, or click this text.</Text>
    </Wrapper>
  );
};

const Text = styled.p`
  cursor: pointer;
`

const Wrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background: black;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: end;
  justify-content: flex-end;
  padding: 30px;
`;
