import { FC, useState, useEffect, useCallback } from "react";

import { render, resize } from "./utils/useThree";

type Props = {
  segments: SegmentMap;
};

const CanvasHandler2: FC<Props> = ({ segments }) => {
  console.log("CanvasHandler2 render");
  const [wrapperRef, setWrapperRef] = useState<Div | null>(null);

  const handleRef = (node: HTMLDivElement) => {
    if (node) {
      setWrapperRef(node);
      render(node, segments, {
        wireframe: true,
      });
    }
  };

  useEffect(() => {
    // Kind of a crude way of forcing a rerender when resizing
    // the window so we can redraw the canvas
    // THIS NEEDS TO BE FIXED (garbage collector doesn't work properly)
    let handleResize: any;

    if (wrapperRef) {
      // TODO: Redraw not working
      window.addEventListener("resize", () => resize(wrapperRef));
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [segments, wrapperRef]);

  return (
    <div ref={handleRef} className="canvas-handler">
      Canvas2
    </div>
  );
};

export default CanvasHandler2;
