import styled from "styled-components";
import { NOOP } from "../../utils";
import { Box } from "../shared/Box";
import { HoverButton } from "../shared/Button";
import { TextShortcut } from "../shared/TextShortcut";

export interface TopBarAction {
  title: string;
  onAction?: () => void;
  shortcutLetter?: string;
  children?: TopBarAction[];
}

export interface TopBarActionsProps {
  actions: TopBarAction[];
}

export const TopBarActions = ({ actions }: TopBarActionsProps) => {
  return (
    <Wrapper>
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
                <HoverButton
                  key={indx}
                  style={{
                    width: "100%",
                    paddingLeft: "30px",
                    paddingTop: "2px",
                    paddingBottom: "2px",
                    textAlign: "left",
                  }}
                >
                  <TextShortcut
                    text={child.title}
                    shortcutLetter={child.shortcutLetter}
                  />
                </HoverButton>
              ))}
            </Box>
          ) : null}
        </ParentAction>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  gap: 0px;
`;

const ParentAction = styled.div`
  border: 2px outset transparent;
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
