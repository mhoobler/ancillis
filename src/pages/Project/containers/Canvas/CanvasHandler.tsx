import { FC, useState, useEffect, useMemo, memo } from "react";

import useThree from "./utils/useThree";

type Props = {
  segments: SegmentMap;
};

const isEqual = (pp: Props, np: Props) => {
  const ppKeys = Object.keys(pp.segments);
  const npKeys = Object.keys(np.segments);

  if (ppKeys.length !== npKeys.length) {
    return false;
  }

  for (let i = 0; i < ppKeys.length; i++) {
    const ppSegment = pp.segments[ppKeys[i]];
    const npSegment = np.segments[npKeys[i]];

    if (npSegment.type !== ppSegment.type) {
      return false;
    }
  }

  return true;
};

const CanvasHandler: FC<Props> = ({ segments }) => {
  const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);
  const unwrappedSegments = Object.keys(segments).map((key) => {
    return segments[key];
  });

  const { init } = useThree(unwrappedSegments, { gui: true });

  const handleRef = (node: HTMLDivElement) => {
    if (node) {
      setWrapperRef(node);
    }
  };

  const createScene = useMemo(() => {
    if (wrapperRef) {
      init(wrapperRef);
    }
  }, [wrapperRef, init]);

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

  return <div ref={handleRef} className="canvas-handler"></div>;
};

export default CanvasHandler;
