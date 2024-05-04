import styled from "styled-components";
import { AppProps } from "../../types";
import { ClearButton, DefaultButton } from "../shared/Button";
import { Divider, LongDivider, ThickDivider } from "../shared/Dividers";
import { Icon } from "../shared/icon";
import { themeStyles } from "../shared/theme";
import { TopBarAction, TopBarActions } from "../Window/TopBarActions";

const ToolbarAction = () => {
  return (
    <ToolbarButton>
      <ToolbarButtonIcon>
        <Icon index={1} name={"application_hourglass"} />
      </ToolbarButtonIcon>
     Forward 
    </ToolbarButton>
  );
};

export const WindowsExplorer = ({ windowData }: AppProps) => {
  const topBarActions: TopBarAction[] = [
    {
      title: "File",
      children: [
        {
          title: "File",
          onAction: () => console.log("pepo"),
        },
      ],
    },
    {
      title: "Edit",
      onAction: () => console.log("hellopeppoep"),
    },
    {
      title: "Search",
      onAction: () => console.log("hellopeppoep"),
    },
    {
      title: "Help",
      onAction: () => console.log("hellopeppoep"),
    },
  ];
  return (
    <Wrapper>
      <WrapperActions>
        <TopBarActions actions={topBarActions}>
          <FileActions>
            <Divider style={{ margin: "2px" }} />
            <ToolbarAction />
            <ToolbarAction />
            <ToolbarAction />
            <LongDivider/>
            <ToolbarAction />
            <ToolbarAction />
          </FileActions>

          <AddressBar>
            Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
            cillum sint consectetur cupidatat.
          </AddressBar>
        </TopBarActions>
      </WrapperActions>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <img src="/assets/images/icons/ico/application_hourglass-0.ico" />
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

const AddressBar = styled.div`
  border-top: ${themeStyles.baseBorderWhite};
  box-shadow: ${themeStyles.baseBorderShadowThin};
`;

const FileActions = styled.div`
  border-top: ${themeStyles.baseBorderWhite};
  box-shadow: ${themeStyles.baseBorderShadowThin};
  display: flex;
  align-items: center;
  padding: 2px 0;
`;

const WrapperActions = styled.div`
  box-shadow: ${themeStyles.baseBorderShadowWhite};
  border: ${themeStyles.baseBorderThin};
`;

const Wrapper = styled.div`
  margin-top: 1px;
  /* display: flex; */
  font-size: 12px;
  /* gap: 16px; */
  /* padding: 2px; */
`;

const ToolbarButton = styled.button`
  width: 52px;
  height: 40px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
`;

const ToolbarButtonIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
