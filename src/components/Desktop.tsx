import styled from "styled-components";
import { useAuth } from "../hooks/os";
import { LoggedInView } from "./LoggedInView";
import { LoggedOutView } from "./LoggedOutView";

export const Desktop = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Wrapper>
      <>{isLoggedIn ? <LoggedInView /> : <LoggedOutView />}</>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
