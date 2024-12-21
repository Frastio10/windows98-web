import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import System from "../../../libs/System";
import { NOOP } from "../../../utils";

const Media = forwardRef((_, ref) => {
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const snapshotCanvas = useRef<HTMLCanvasElement>(
    document.createElement("canvas"),
  );

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (!videoRef.current) return;

          const track = stream.getVideoTracks()[0];
          videoRef.current.srcObject = stream;
          const settings = track.getSettings();
          snapshotCanvas.current.width = settings.width || 640;
          snapshotCanvas.current.height = settings.height || 480;
          setIsReady(true);
        })
        .catch((error) => {
          setIsReady(false);
          System.messageBox(undefined, {
            title: "Error!",
            description: "Error accessing the camera: " + error.message,
            width: 300,
            height: 120,
            cb: NOOP,
          });
        });
    }
  }, []);

  const snapShot = () => {
    if (!videoRef.current || !isReady) return;
    const ctx = snapshotCanvas.current.getContext("2d")!;
    const cnv = snapshotCanvas.current;

    ctx.drawImage(videoRef.current, 0, 0, cnv.width, cnv.height);

    const url = snapshotCanvas.current.toDataURL("image/jpeg", 0.2);
    return url;
  };

  useImperativeHandle(ref, () => ({
    snapShot,
    getCanvas: () => snapshotCanvas.current,
  }));

  return <video className="" autoPlay ref={videoRef} onClick={snapShot} />;
});

export default Media;
// "react": "^18.2.0",
