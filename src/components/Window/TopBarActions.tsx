import styled from "styled-components";
import { NOOP } from "../../utils";
import { Box } from "../shared/Box";
import { ColoredHoverButton } from "../shared/Button";
import { ThickDivider } from "../shared/Dividers";
import { TextShortcut } from "../shared/TextShortcut";

export interface TopBarAction {
  title: string;
  onAction?: () => void;
  shortcutLetter?: string;
  children?: TopBarAction[];
}

export interface TopBarActionsProps {
  actions: TopBarAction[];
  children?: React.ReactNode;
}

export const TopBarActions = ({ actions, children }: TopBarActionsProps) => {
  return (
    <Wrapper>
      <MainActionsWrapper>
        <ThickDivider style={{marginInline: '2px'}} />
        {actions.map((action, index) => (
          <ParentAction
            key={index}
            onClick={action.children ? NOOP : action.onAction}
          >
            <TextShortcut text={action.title} />
            {action.children?.length ? (
              <Box
                className="child"
                style={{
                  display: "none",
                  position: "absolute",
                  width: "150px",
                  left: "-2px",
                  top: "110%",
                }}
              >
                {action.children.map((child, indx) => (
                  <ColoredHoverButton
                    key={indx}
                    style={{
                      width: "100%",
                      paddingLeft: "30px",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      textAlign: "left",
                    }}
                    onClick={child.onAction}
                  >
                    <TextShortcut
                      text={child.title}
                      shortcutLetter={child.shortcutLetter}
                    />
                  </ColoredHoverButton>
                ))}
              </Box>
            ) : null}
          </ParentAction>
        ))}
      </MainActionsWrapper>

      {children}
    </Wrapper>
  );
};

const MainActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0px;
  padding: 2px 0px;
  height: 20px;
`;

const Wrapper = styled.div`
padding: 0 1px;
`;

const ParentAction = styled.div`
  border: 1px outset transparent;
  background: none;
  margin: 0;
  padding: 1px 4px;
  position: relative;
  /* box-shadow: 1px 1px #000; */

  &:hover {
    border: 2px inset #fff;
    box-shadow: -1px -1px #000;

    .child {
      display: block !important;
    }
  }
`;

/* font-weight: ${({ isFocused }) => (isFocused ? "700" : "")}; */
