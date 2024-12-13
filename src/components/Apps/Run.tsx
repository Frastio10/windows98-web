import styled from "styled-components";
import { AppProps } from "../../types";
import { Icon } from "../shared/icon";

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
        <Icon name="application_hourglass" index={0} />
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
