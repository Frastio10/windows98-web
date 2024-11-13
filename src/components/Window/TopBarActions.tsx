import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { NOOP } from "../../utils";
import { Box } from "../shared/Box";
import { ColoredHoverButton } from "../shared/Button";
import { ThickDivider } from "../shared/Dividers";
import SectionDivier from "../shared/SectionDivier";
import { TextShortcut } from "../shared/TextShortcut";

type TopBarActionType = "default" | "checkbox" | "divider" | "group";

export interface TopBarAction {
  title?: string;
  type?: TopBarActionType;
  onAction?: (isChecked?: any) => void;
  shortcutLetter?: string;

  children?: TopBarAction[];
}

export interface TopBarActionsProps {
  actions: TopBarAction[];
  children?: React.ReactNode;
}

const TopBarActionButton = ({ action }: { action: TopBarAction }) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <ColoredHoverButton
      style={{
        display: "flex",
        width: "100%",
        paddingLeft: isChecked ? 0 : "30px",
        height: "24px",
        // paddingTop: "4px",
        // paddingBottom: "4px",
        textAlign: "left",
      }}
      onClick={(ev) => {
        const handle = action.onAction || NOOP;

        if (action.type !== "checkbox") handle(ev);
        else {
          setIsChecked((prev) => {
            handle(!prev);
            return !prev;
          });
        }
      }}
    >
      {action.type === "checkbox" && (
        <div className=" shrink-0 ">
          {isChecked && (
            <img
              className="mx-[7px]  w-[16px] h-[16px]"
              src="/assets/icons/etc/check.svg"
            />
          )}
        </div>
      )}
      <TextShortcut
        text={action.title || ""}
        shortcutLetter={action.shortcutLetter}
      />
    </ColoredHoverButton>
  );
};

const TopBarParentAction = ({ action }: { action: TopBarAction }) => {
  return (
    <ParentAction onClick={action.children ? NOOP : action.onAction}>
      <TextShortcut text={action.title || ""} />
      {action.children?.length ? (
        <Box
          className="child"
          style={{
            display: "none",
            position: "absolute",
            width: "150px",
            left: "-2px",
            top: "110%",
            // background: "red",
            padding: "3px 0",
          }}
        >
          {action.children.map((child, indx) => {
            if (
              !child.type ||
              child.type === "default" ||
              child.type === "checkbox"
            ) {
              return <TopBarActionButton key={indx} action={child} />;
            } else if (child.type === "divider") {
              return <SectionDivier key={indx} />;
            }
          })}
        </Box>
      ) : null}
    </ParentAction>
  );
};

export const TopBarActions = ({ actions, children }: TopBarActionsProps) => {
  return (
    <Wrapper>
      <MainActionsWrapper>
        <ThickDivider style={{ marginInline: "2px" }} />
        {actions.map((action, index) => {
          if (!action.type || action.type === "default") {
            return <TopBarParentAction key={index} action={action} />;
          } else if (action.type === "divider") {
            return <hr key={index} />;
          }
        })}
      </MainActionsWrapper>

      {/* {children} */}
    </Wrapper>
  );
};

const memo = React.memo(TopBarActions);
memo.displayName = "TopBarActions";

export default memo;

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
