import styled from "styled-components";
import { useLogin } from "../../hooks/zustand/useAuthState";
import { useWindowState } from "../../hooks/zustand/useWindowState";
import { DefaultButton } from "../shared/Button";

export const LogInForm = () => {
  const { updatePassword, login } = useLogin();
  const { closeWindow } = useWindowState()

  const handleLogin = () => {
    login()
    closeWindow('logInForm')
  }
  return (
    <Wrapper>
      <div
        style={{
          width: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <img src="/assets/images/key_win_alt-2.png" />
      </div>
      <div>
        <p>Type a user name and password to log on to Windows.</p>
        <FormGroup>
          <FormField>
            <p>
              <u>U</u>ser name
            </p>
            <Input onChange={(e) => updatePassword(e.target.value)} />
          </FormField>
          <FormField>
            <p>
              <u>P</u>assword
            </p>
            <Input onChange={(e) => updatePassword(e.target.value)} />
          </FormField>
        </FormGroup>
      </div>
      <Actions>
        <LoginButton onClick={handleLogin}>OK</LoginButton>
        <LoginButton onClick={() => { }}>Cancel</LoginButton>
      </Actions>
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
  gap: 20px;
  padding: 16px;
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
