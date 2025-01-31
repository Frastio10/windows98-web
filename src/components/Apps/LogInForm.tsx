import styled from "styled-components";
import { useAuth, useWindow } from "../../hooks/os";
import { AppProps } from "../../types";
import { DefaultButton } from "../shared/Button";
import { Icon } from "../shared/icon";

export const LogInForm = ({ windowData }: AppProps) => {
  const { updatePassword, login } = useAuth();
  const { closeWindow } = useWindow();

  const handleLogin = () => {
    login();
    closeWindow("logInForm");
  };
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
        <Icon name="key_win_alt" index={2} />
      </div>
      <div>
        <p>Type a user name and password to log on to Windows.</p>
        <p>(PUT ANYTHING)</p>
        <FormGroup>
          <FormField>
            <p>
              <u>U</u>ser name
            </p>
            <Input
              onChange={(e) => updatePassword(e.target.value)}
              defaultValue="User"
            />
          </FormField>
          <FormField>
            <p>
              <u>P</u>assword
            </p>
            <Input
              onChange={(e) => updatePassword(e.target.value)}
              type="password"
              defaultValue="Helloworld69"
            />
          </FormField>
        </FormGroup>
      </div>
      <Actions>
        <LoginButton onClick={handleLogin}>OK</LoginButton>
        <LoginButton onClick={() => {}}>Cancel</LoginButton>
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
  user-select: none !important;
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
  padding: 4px;
  box-shadow: ${({ theme }) => theme.insetPixelatedBorder};
`;

const LoginButton = styled(DefaultButton)`
  padding: 5px 20px;
`;
