import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import LZString from "lz-string";
import styled from "styled-components";
import { useFileSystem, useWindow } from "../../../hooks/os";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter";
import { FileNode } from "../../../libs/FileSystem";
import System from "../../../libs/System";
import { AppProps, WindowData } from "../../../types";
import { generateRandomString, iconSize } from "../../../utils";
import { DefaultButton } from "../../shared/Button";
import { themeStyles } from "../../shared/theme";
import Gallery from "./Gallery";
import Media from "./Media";
import { TopBarAction, TopBarActions } from "../../Window/TopBarActions";

export interface CameraProps {
  title?: string;
  description?: string;
  showWarningIcon?: boolean;
  width?: number;
  height?: number;
}

const SAVE_FOLDER_NAME = "Camera";

export function Camera({ windowData }: AppProps<CameraProps>) {
  const { fileSystem, updateFileSystem } = useFileSystem();
  const { changeWindowTitle } = useWindow();

  const [currentImage, setCurrentImage] = useState<FileNode | null>(null);

  const mediaRef = useRef<{
    snapShot: () => string;
    getCanvas: () => HTMLCanvasElement;
  }>(null);

  function generatePictureFileName(extension = "jpg") {
    const today = new Date();

    const dateString = today.toISOString().split("T")[0].replace(/-/g, "");

    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const seconds = String(today.getSeconds()).padStart(2, "0");
    const timeString = `${hours}${minutes}${seconds}`;

    // Combine date and time with extension to form the file name
    return `${dateString}_${timeString}.${extension}`;
  }

  const saveImage = (dataUrl: string) => {
    const picturesFolder = fileSystem.getNodeByPath("C:/Pictures");
    let cameraFolder = picturesFolder?.children.find(
      (f) => f.name === SAVE_FOLDER_NAME,
    );

    if (!cameraFolder) {
      cameraFolder = new FileNode(SAVE_FOLDER_NAME, true, picturesFolder);
      picturesFolder?.addChild(cameraFolder);
    }

    const b64File = new FileNode(
      generatePictureFileName("b64"),
      false,
      cameraFolder,
    );

    b64File.content = LZString.compressToUTF16(dataUrl);

    cameraFolder.addChild(b64File);

    updateFileSystem();
  };

  const getPictures = () => {
    const cameraFolder = fileSystem.getNodeByPath("C:/Pictures/Camera");
    return cameraFolder?.children;
  };

  const handleSnapshot = () => {
    if (currentImage) return setCurrentImage(null);

    if (mediaRef.current) {
      const dataUrl = mediaRef.current.snapShot();
      saveImage(dataUrl);
      // const img = document.createElement("img");
      // img.src = dataUrl;
      // document.getElementById("root")?.prepend(img);
    }
  };

  useEffect(() => {
    if (currentImage) {
      changeWindowTitle(windowData.windowId, currentImage.name + " - Camera");
    } else {
      changeWindowTitle(windowData.windowId, "Camera");
    }
  }, [currentImage]);

  const topBarActions: TopBarAction[] = [
    {
      title: "File",
      children: [
        {
          title: "New",
          onAction: () => {},
        },
        {
          title: "Open...",
          onAction: () => {},
        },
      ],
    },
    {
      title: "Edit",
      children: [
        {
          title: "New",
          onAction: () => {},
        },
        {
          title: "Open...",
          onAction: () => {},
        },
      ],
    },

    {
      title: "View",
      children: [
        {
          title: "New",
          onAction: () => {},
        },
        {
          title: "Open...",
          onAction: () => {},
        },
      ],
    },
  ];

  const pictures = getPictures();

  return (
    <Wrapper>
      <TopBarActions actions={topBarActions} />
      <MediaWrapper>
        {currentImage ? (
          <img src={LZString.decompressFromUTF16(currentImage.content)} />
        ) : (
          <Media ref={mediaRef} />
        )}
      </MediaWrapper>
      <div className="flex-shrink-0">
        {pictures?.length && (
          <GalleryWrapper>
            <Gallery
              files={pictures || []}
              onSelectImage={(file) => setCurrentImage(file)}
            />
          </GalleryWrapper>
        )}
        <FooterWrapper>
          <div
            className="w-12 h-12 bg-[#aa0000] rounded-full flex justify-center items-center"
            onClick={handleSnapshot}
          >
            <svg
              fill="#fff"
              height="20"
              width="20"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 487 487"
              xmlSpace="preserve"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                <g>
                  <g>
                    <path d="M308.1,277.95c0,35.7-28.9,64.6-64.6,64.6s-64.6-28.9-64.6-64.6s28.9-64.6,64.6-64.6S308.1,242.25,308.1,277.95z M440.3,116.05c25.8,0,46.7,20.9,46.7,46.7v122.4v103.8c0,27.5-22.3,49.8-49.8,49.8H49.8c-27.5,0-49.8-22.3-49.8-49.8v-103.9 v-122.3l0,0c0-25.8,20.9-46.7,46.7-46.7h93.4l4.4-18.6c6.7-28.8,32.4-49.2,62-49.2h74.1c29.6,0,55.3,20.4,62,49.2l4.3,18.6H440.3z M97.4,183.45c0-12.9-10.5-23.4-23.4-23.4c-13,0-23.5,10.5-23.5,23.4s10.5,23.4,23.4,23.4C86.9,206.95,97.4,196.45,97.4,183.45z M358.7,277.95c0-63.6-51.6-115.2-115.2-115.2s-115.2,51.6-115.2,115.2s51.6,115.2,115.2,115.2S358.7,341.55,358.7,277.95z" />{" "}
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </FooterWrapper>
      </div>
    </Wrapper>
  );
}

const FooterWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 4px 0;
  height: 60px;
  flex-shrink: 0;
`;

const GalleryWrapper = styled.div`
  flex-shrink: 0;
  height: 75px;
`;

const MediaWrapper = styled.div`
  background: #000;
  flex-grow: 1;
  // height: 100%;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  font-size: 12px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  box-shadow: ${themeStyles.baseBorderShadowWhite};
  border: ${themeStyles.baseBorderThin};
  height: 100%;
`;
