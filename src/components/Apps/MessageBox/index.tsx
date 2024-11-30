import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useWindow } from "../../../hooks/os";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter";
import System from "../../../libs/system";
import { AppProps, WindowData } from "../../../types";
import { iconSize } from "../../../utils";
import { DefaultButton } from "../../shared/Button";

// https://learn.microsoft.com/en-us/dotnet/api/system.windows.forms.messageboxbuttons
export enum MessageBoxButtons {
  OK = 0,
  OKCancel = 1,
  AbortRetryIgnore = 2,
  YesNoCancel = 3,
  YesNo = 4,
  RetryCancel = 5,
  CancelTryContinue = 6,
}

// https://learn.microsoft.com/en-us/dotnet/api/system.windows.forms.dialogresult
export enum DialogResult {
  None = 0,
  OK = 1,
  Cancel = 2,
  Abort = 3,
  Retry = 4,
  Ignore = 5,
  Yes = 6,
  No = 7,
  TryAgain = 10,
  Continue = 11,
}

type MessageBoxResult = {
  result: DialogResult;
  windowData: WindowData;
};

export interface MessageBoxProps {
  title?: string;
  description?: string;
  showWarningIcon?: boolean;
  width?: number;
  height?: number;

  buttons?: MessageBoxButtons;

  cb: (result: MessageBoxResult) => void;
}

export function MessageBox({ windowData }: AppProps<MessageBoxProps>) {
  const { changeWindowTitle, changeFocus, activeWindows } = useWindow();

  const props = {
    showWarningIcon: true,
    buttons: MessageBoxButtons.OK,
    ...windowData.args,
  } as MessageBoxProps;

  const playAudio = async () => {
    const audioManager = System.getInstance().audio();
    await audioManager.loadAudio("/assets/audio/system/error.mp3");
    audioManager.play();
  };

  useEffect(() => {
    if (windowData.args) {
      playAudio();
      changeWindowTitle(windowData.windowId, windowData.args.title);
    }
  }, []);

  useEffect(() => {
    const activeWin = activeWindows.find((win) => win.isFocused);

    if (activeWin?.windowId === windowData.attachedTo) {
      playAudio();
      changeFocus(windowData.windowId);
    }
  });

  const onButtonClick = (result: DialogResult) => {
    windowData.args?.cb({
      result: result,
      windowData,
    });
  };

  const actions = [
    {
      type: MessageBoxButtons.OK,
      buttons: [
        {
          result: DialogResult.OK,
          label: "OK",
        },
      ],
    },

    {
      type: MessageBoxButtons.OKCancel,
      buttons: [
        {
          result: DialogResult.OK,
          label: "OK",
        },
        {
          result: DialogResult.Cancel,
          label: "Cancel",
        },
      ],
    },

    {
      type: MessageBoxButtons.AbortRetryIgnore,
      buttons: [
        {
          result: DialogResult.Abort,
          label: "Abort",
        },
        {
          result: DialogResult.Retry,
          label: "Retry",
        },
        {
          result: DialogResult.Ignore,
          label: "Ignore",
        },
      ],
    },

    {
      type: MessageBoxButtons.YesNoCancel,
      buttons: [
        {
          result: DialogResult.Yes,
          label: "Yes",
        },
        {
          result: DialogResult.No,
          label: "No",
        },
        {
          result: DialogResult.Cancel,
          label: "Cancel",
        },
      ],
    },

    {
      type: MessageBoxButtons.YesNo,
      buttons: [
        {
          result: DialogResult.Yes,
          label: "Yes",
        },
        {
          result: DialogResult.No,
          label: "No",
        },
      ],
    },

    {
      type: MessageBoxButtons.RetryCancel,
      buttons: [
        {
          result: DialogResult.Retry,
          label: "Retry",
        },
        {
          result: DialogResult.Cancel,
          label: "Cancel",
        },
      ],
    },

    {
      type: MessageBoxButtons.CancelTryContinue,
      buttons: [
        {
          result: DialogResult.Cancel,
          label: "Cancel",
        },
        {
          result: DialogResult.TryAgain,
          label: "Try Again",
        },
        {
          result: DialogResult.Continue,
          label: "Continue",
        },
      ],
    },
  ];

  const action = useMemo(() => {
    return actions.find((action) => action.type === props.buttons);
  }, []);

  return (
    <Wrapper>
      <ContentWrapper>
        {props.showWarningIcon && (
          <IconWrapper>
            <Icon src={iconSize("msg_warning", "big")} />
          </IconWrapper>
        )}
        {props?.description}
      </ContentWrapper>
      <FooterWrapper>
        {action?.buttons.map((button) => (
          <DefaultButton
            className="w-20"
            onClick={() => onButtonClick(button.result)}
          >
            {button.label}
          </DefaultButton>
        ))}
      </FooterWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  font-size: 12px;
  display: flex;
  flex-direction: column;
`;

const FooterWrapper = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  padding: 16px 18px;
`;

const IconWrapper = styled.div`
  margin-right: 18px;
  flex-shrink: 0;
`;

const Icon = styled.img`
  width: 32px;
  heigh: 32px;
`;
