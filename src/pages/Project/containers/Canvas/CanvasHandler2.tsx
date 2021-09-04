import { FC, useState, useEffect, useMemo } from "react";

import { init } from "./utils/handleThree";

type Props = {
  segments: SegmentMap;
};
//const isEqual = (pp: Props, np: Props) => {
//  const ppKeys = Object.keys(pp.segments);
//  const npKeys = Object.keys(np.segments);
//
//  if (ppKeys.length !== npKeys.length) {
//    return false;
//  }
//
//  for (let i = 0; i < ppKeys.length; i++) {
//    const ppSegment = pp.segments[ppKeys[i]];
//    const npSegment = np.segments[npKeys[i]];
//
//    if (npSegment.type !== ppSegment.type) {
//      return false;
//    }
//  }
//
//  return true;
//};

const CanvasHandler2: FC<Props> = ({ segments }) => {
  const [wrapperRef, setWrapperRef] = useState<Div | null>(null);

  const handleRef = (node: HTMLDivElement) => {
    if (node) {
      setWrapperRef(node);
      console.log(node);
    }
  };

  const createScene = useMemo(() => {
    if (wrapperRef) {
      init(wrapperRef, Object.values(segments), {
        wireframe: true,
      });
    }
  }, [wrapperRef, segments]);

  useEffect(() => {
    // Kind of a crude way of forcing a rerender when resizing
    // the window so we can redraw the canvas
    // THIS NEEDS TO BE FIXED (garbage collector doesn't work properly)
    let handleResize: any;

    if (wrapperRef) {
      handleResize = () => setWrapperRef(null);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [createScene, wrapperRef]);

  return (
    <div ref={handleRef} className="canvas-handler">
      Canvas2
    </div>
  );
};

export default CanvasHandler2;
