import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TopBarAction, TopBarActions } from "../../Window/TopBarActions";

const PinballGame = () => {
  const topBarActions: TopBarAction[] = [
    {
      title: "Save",
      onAction: () => {},
    },
  ];
  return (
    <Wrapper>
      <TopBarActions actions={topBarActions} />
      <iframe
        width={"100%"}
        height={"100%"}
        src="http://localhost:5173/apps/SpaceCadetPinball/index.html"
      />
    </Wrapper>
  );
};

export default PinballGame;

const Wrapper = styled.div`
  display: flex;
  font-size: 12px;
  gap: 2px;
  height: 100%;
  padding: 2px;
  flex-direction: column;
`;
