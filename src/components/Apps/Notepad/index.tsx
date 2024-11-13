import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useWindow } from "../../../hooks/os";
import { useFileSystem } from "../../../hooks/zustand/useFileSystem";
import { FileNode } from "../../../libs/fileSystem";
import { AppProps } from "../../../types";
import { iconSize, log, NOOP } from "../../../utils";
import TopBarActions from "../../Window/TopBarActions";
import type { TopBarAction } from "../../Window/TopBarActions";
import LZString from "lz-string";
import NotepadTextArea from "./TextArea";
import { Window } from "../../Window";

import api from "../../../api";

const Alert = () => (
  <div>
    Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum
    sint consectetur cupidatat.
  </div>
);

export const Notepad = ({ windowData }: AppProps) => {
  const { changeWindowTitle } = useWindow();
  const { fileSystem, updateFileSystem } = useFileSystem();

  const [value, setValue] = useState("");
  const [currentFile, setCurrentFile] = useState<FileNode | null>(null);
  const [isSaved, setIsSaved] = useState<null | boolean>(null);
  const [textSelection, setTextSelection] = useState({
    start: 0,
    end: 0,
  });
  const [config, setConfig] = useState({
    wordWrap: false,
  });

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (windowData.args) {
      const file = fileSystem.getNodeByPath(windowData.args);
      if (!file)
        return log(
          `Failed to open file. File '${windowData.args}' is not found`,
        );
      setCurrentFile(file);

      changeWindowTitle(windowData.windowId, file.name + " - Notepad");
      updateText(LZString.decompressFromUTF16(file.content));
      setIsSaved(true);
    }
  }, []);

  useEffect(() => {
    if (isSaved !== null) {
      const savedMarker = isSaved === false ? "*" : "";
      let str = savedMarker + windowData.title.replace("*", "");

      changeWindowTitle(windowData.windowId, str);
    }
  }, [isSaved]);

  const saveAsNewFile = () => {
    try {
      const filename = prompt("*.txt") || "Untitled";
      const desktopNode = fileSystem.getNodeByPath("C:/WINDOWS/Desktop");

      const file = fileSystem.createFileNode(filename, false, desktopNode);

      changeWindowTitle(windowData.windowId, filename + " - Notepad");
      file.content = LZString.compressToUTF16(value);
      setCurrentFile(file);

      desktopNode?.addChild(file);
      updateFileSystem();
      setIsSaved(true);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const openNewInstance = () => {
    setCurrentFile(null);
    updateText("");
    changeWindowTitle(windowData.windowId, null);
    setIsSaved(true);
  };

  const saveCurrent = () => {
    if (!currentFile) return saveAsNewFile();
    if (value === currentFile.content) return;

    // this is so ugly.  i have no fucking idea why prevState doesnt work with classes
    const file = currentFile;
    file.content = LZString.compressToUTF16(value);
    setCurrentFile(file);

    updateFileSystem();

    setIsSaved(true);
  };

  const topBarActions: TopBarAction[] = [
    {
      title: "File",
      children: [
        {
          title: "New",
          onAction: () => openNewInstance(),
        },
        {
          title: "Open...",
          onAction: () => openNewInstance(),
        },
        {
          title: "Save",
          onAction: () => saveCurrent(),
        },
        {
          title: "Save As",
          shortcutLetter: "A",
          onAction: () => {
            saveAsNewFile();
          },
        },
        {
          type: "divider",
        },
        {
          title: "Page Setup...",
          onAction: () => saveCurrent(),
        },
        {
          title: "Print",
          shortcutLetter: "A",
          onAction: () => {
            saveAsNewFile();
          },
        },
        {
          type: "divider",
        },
        {
          title: "Exit",
          shortcutLetter: "x",
          onAction: () => {
            saveAsNewFile();
          },
        },
      ],
    },
    {
      title: "Edit",
      onAction: NOOP,
      children: [
        {
          title: "Undo",
          onAction: NOOP,
        },
        {
          type: "divider",
        },
        {
          title: "Cut",
          onAction: () => {
            if (textSelection.start !== textSelection.end) {
              cutText(value, textSelection.start, textSelection.end, (s) => {
                updateText(s);
              });
            }
          },
        },
        {
          title: "Copy",
          onAction: NOOP,
        },
        {
          title: "Paste",
          shortcutLetter: "A",
          onAction: () => pasteText(),
        },
        {
          title: "Delete",
          shortcutLetter: "A",
          onAction: () => deleteText(),
        },
        {
          type: "divider",
        },
        {
          title: "Select All",
          shortcutLetter: "A",
          onAction: () => selectAll(),
        },
        {
          title: "Time Date",
          shortcutLetter: "D",
          onAction: () => insertTimeDate(),
        },
        {
          type: "divider",
        },
        {
          type: "checkbox",
          title: "Word Wrap",
          shortcutLetter: "w",
          onAction: (isWrap) =>
            setConfig((prev) => ({ ...prev, wordWrap: isWrap })),
        },
        {
          type: "checkbox",
          title: "Set font",
          shortcutLetter: "w",
          onAction: NOOP,
        },
      ],
    },
    {
      title: "Search",
      children: [
        {
          title: "Find...",
          shortcutLetter: "A",
          onAction: NOOP,
        },
        {
          title: "Find Next",
          shortcutLetter: "A",
          onAction: NOOP,
        },
      ],
    },
    {
      title: "Help",
      children: [
        {
          title: "Help Topics",
          shortcutLetter: "A",
          onAction: NOOP,
        },
        {
          type: "divider",
        },
        {
          type: "checkbox",
          title: "About Notepad",
          shortcutLetter: "w",
          onAction: () =>
            setConfig((prev) => ({ ...prev, wordWrap: !prev.wordWrap })),
        },
      ],
    },
  ];

  const handleDeleteSelectedText = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      setTextSelection({
        start,
        end,
      });
    }
  };

  const pasteText = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const textarea = textAreaRef.current!;

      // Get the cursor position
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert clipboard text at the cursor position
      const newText =
        textarea.value.substring(0, start) +
        clipboardText +
        textarea.value.substring(end);

      // Update the textarea value
      // textarea.value = newText;
      updateText(newText);

      // Restore the cursor position to after the pasted text
      textarea.setSelectionRange(
        start + clipboardText.length,
        start + clipboardText.length,
      );
      textarea.focus();
    } catch (error) {
      console.error("Failed to read clipboard contents: ", error);
    }
  };

  const cutText = (
    text: string,
    start: number,
    end: number,
    cb?: (s: string) => void,
  ) => {
    if (start !== end) {
      const selectedText = text.substring(start, end);
      api.clipboard
        .writeText(selectedText)
        .then(() => {
          const newText = text.substring(0, start) + text.substring(end);
          if (cb) cb(newText);
        })
        .catch((err) => console.error("Error copying text: ", err));
    }
  };

  const deleteText = () => {
    const { start, end } = textSelection;

    if (start !== end) {
      const newText = value.slice(0, start) + value.slice(end);
      updateText(newText);
    }
  };

  const selectAll = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(0, value.length);
    }
  };

  const updateText = (text = "") => {
    const textarea = textAreaRef.current;
    if (textarea) {
      setValue(text);
      textAreaRef.current.value = text;
    }
  };

  const getCurrentFormattedTime = () => {
    const now = new Date();

    const timeString = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });

    const dateString = now.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    // Combine time and date
    return `${timeString} ${dateString}`;
  };

  const insertTimeDate = () => {
    textAreaRef.current?.focus();
    const { start, end } = textSelection;
    const dateTimeString = getCurrentFormattedTime();
    // Insert the formatted time at the current cursor location or selection
    const newText = value.slice(0, start) + dateTimeString + value.slice(end);
    updateText(newText);
  };

  return (
    <Wrapper>
      <TopBarActions actions={topBarActions} />
      <TextAreaWrapper>
        <NotepadTextArea
          ref={textAreaRef}
          defaultValue={value}
          enableWordWrap={config.wordWrap}
          onSelect={handleDeleteSelectedText}
          onChange={(ev) => {
            setValue(ev.target.value);
            setIsSaved(false);
          }}
          onKeyDown={(ev) => {
            if ((ev.ctrlKey || ev.metaKey) && ev.key === "s") {
              ev.preventDefault();
              saveCurrent();
            }
          }}
        />
      </TextAreaWrapper>
    </Wrapper>
  );
};

const TextAreaWrapper = styled.div`
  box-shadow: ${({ theme }) => theme.insetPixelatedBorder};
  width: 100%;
  padding: 2px;
  height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  font-size: 12px;
  gap: 2px;
  height: 100%;
  padding: 2px;
  flex-direction: column;
`;
