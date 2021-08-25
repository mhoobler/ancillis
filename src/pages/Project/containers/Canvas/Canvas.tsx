import { FC, useState, useEffect, useCallback, useContext } from "react";
import useThree from "./utils/useThree";
import { ProjectContext } from "../../utils/ProjectContext";

const Canvas: FC = () => {
  const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);
  const { state } = useContext(ProjectContext);
  const segments = Object.keys(state.segments).map(
    (key) => state.segments[key]
  );
  const { init } = useThree(segments, { gui: true });

  const createScene = useCallback(
    (node: HTMLDivElement) => {
      init(node);
    },
    [init]
  );

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
