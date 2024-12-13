import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useWindow } from "../../../hooks/os";
import { useFileSystem } from "../../../hooks/zustand/useFileSystem";
import { FileNode } from "../../../libs/FileSystem";
import { AppProps } from "../../../types";
import { log, MENU_DIVIDER, NOOP } from "../../../utils";
import TopBarActions from "../../Window/TopBarActions";
import type { TopBarAction } from "../../Window/TopBarActions";
import NotepadTextArea from "./TextArea";

import api from "../../../api";
import System from "../../../libs/System";
import { DialogResult } from "../MessageBox";

export const Notepad = ({ windowData }: AppProps) => {
  const { changeWindowTitle, changeFocus, closeWindowById } = useWindow();
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
      updateText(file.content);
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

  const openFile = (file: FileNode) => {
    setCurrentFile(file);

    changeWindowTitle(windowData.windowId, file.name + " - Notepad");
    updateText(file.content);
    setIsSaved(true);
  };

  const txtFileType = {
    title: "Text Document",
    ext: ".txt",
    key: "txt",
  };

  const saveAsNewFile = () => {
    try {
      System.saveFileDialog(windowData.windowId, {
        fileTypes: [txtFileType],
        defaultFileName: "Untitled",
        defaultFileType: txtFileType,
        onResult: (e) => {
          const file = fileSystem.writeFile(e.filePaths[0], value);

          if (!file) return;

          setCurrentFile(file);
          changeWindowTitle(windowData.windowId, file.name + " - Notepad");
          updateFileSystem();
          setIsSaved(true);
        },
      });
    } catch (err) {
      const str = System.messageBox(windowData.windowId, {
        description: (err as Error).message,
        title: currentFile?.name + " - Notepad",
        showWarningIcon: true,
        width: 400,
        height: 100,
        cb: (r) => {
          if (r.result === DialogResult.OK) {
          }

          closeWindowById(r.windowData.windowId);
        },
      });

      changeFocus(str);
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

    const file = currentFile;
    file.content = value;
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
          onAction: () => {
            System.openFileDialog(windowData.windowId, {
              isFileOnly: true,
              fileTypes: [txtFileType],
              defaultFileType: txtFileType,
              onResult: (e) => {
                const foundFile = fileSystem.getNodeByPath(e.filePaths[0]);
                if (!foundFile) {
                  return System.messageBox(windowData.windowId, {
                    description: "File not found",
                    title: currentFile?.name + " - Notepad",
                    showWarningIcon: true,
                    width: 400,
                    height: 100,
                    cb: (r) => {
                      closeWindowById(r.windowData.windowId);
                    },
                  });
                }

                openFile(foundFile);
              },
            });
          },
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

        MENU_DIVIDER,

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

        MENU_DIVIDER,

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

        MENU_DIVIDER,

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

        MENU_DIVIDER,

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

        MENU_DIVIDER,

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

        MENU_DIVIDER,

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
      setTextSelection({
        start: 0,
        end: value.length,
      });
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
