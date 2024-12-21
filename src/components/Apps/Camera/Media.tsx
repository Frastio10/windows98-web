import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

const Media = forwardRef((_, ref) => {
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
        })
        .catch((error) => {
          console.error("Error accessing the camera: ", error);
        });
    }
  }, []);

  const snapShot = () => {
    if (!videoRef.current) return;
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
