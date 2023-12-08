import styled from "styled-components";
import { useLogin } from "../../hooks/zustand/useAuthState";
import { useWindowState } from "../../hooks/zustand/useWindowState";
import { DefaultButton } from "../shared/Button";

export const Run = () => {
  const { updatePassword, login } = useLogin();
  const { closeWindow } = useWindowState();
  console.log("haha");

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
        <p>Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</p>
      </div>
    </Wrapper>
  );
};

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Wrapper = styled.div`
  display: flex;
  font-size: 12px;
  gap: 16px;
  padding: 18px 8px;
`;

const FormGroup = styled.div`
  margin-top: 15px;
`;

const FormField = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 140px;
  height: 25px;
  border: none;
  box-shadow: ${({ theme }) => theme.insetPixelatedBorder};
`;

const LoginButton = styled(DefaultButton)`
  padding: 5px 20px;
`;
