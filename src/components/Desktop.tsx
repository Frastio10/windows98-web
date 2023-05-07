import styled from "styled-components";
import { useLogin } from "../hooks/zustand/useAuthState";
import { LoggedInView } from "./LoggedInView";
import { LoggedOutView } from "./LoggedOutView";

export const Desktop = () => {
  const { isLoggedIn } = useLogin();

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
