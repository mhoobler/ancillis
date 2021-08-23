import { FC, useState, useEffect, useCallback } from "react";
import ThreeHandler from "./utils/ThreeHandler";

var THREE: ThreeHandler | null = null;

const Canvas: FC = () => {
  const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);
  const [scene, setScene] = useState<any>(null);

  const createScene = useCallback((node: HTMLDivElement) => {
    if (!THREE) {
      THREE = new ThreeHandler(node);
      THREE.bindDiv(node);
    }
    setScene(THREE.scene);
    THREE.addSegment("SOCKET");
    THREE.addSegment("SOCKET");
    THREE.addSegment("SOCKET");
    THREE.addSegment("SOCKET");
    THREE.getHelpers();
  }, []);

  useEffect(() => {
    // Kind of a crude way of forcing a rerender when resizing
    // the window so we can redraw the canvas
    let handleResize: any;

    if (wrapperRef) {
      createScene(wrapperRef);
      handleResize = () => setWrapperRef(null);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [createScene, wrapperRef]);

  const handleRef = (node: HTMLDivElement) => {
    if (node) {
      setWrapperRef(node);
    }
  };

  return <div ref={handleRef} className="canvas-wrapper"></div>;
};

export default Canvas;
