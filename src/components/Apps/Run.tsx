import styled from "styled-components";
import { useWindowState } from "../../hooks/zustand/useWindowState";
import { AppProps } from "../../types";
import { DefaultButton } from "../shared/Button";

export const Run = ({ windowData }: AppProps) => {
  return (
    <Wrapper>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <img src="/assets/images/medium/application_hourglass-big.png" />
      </div>
      <div>
        <p>
          Type the name of a program, folder, document, or Internet resource,
          and Windows will open it for you.
        </p>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  font-size: 12px;
  gap: 16px;
  padding: 18px 8px;
`;
