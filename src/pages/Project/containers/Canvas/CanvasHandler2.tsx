import { FC, useState, useEffect } from "react";

import { init } from "./utils/handleThree";
import testThree from "./utils/useThree";

type Props = {
  segments: SegmentMap;
};

const CanvasHandler2: FC<Props> = ({ segments }) => {
  console.log("CanvasHandler2 render");
  const [wrapperRef, setWrapperRef] = useState<Div | null>(null);

  const handleRef = (node: HTMLDivElement) => {
    if (node) {
      setWrapperRef(node);
      testThree(node, segments, {
        wireframe: true,
      });
    }
  };

  // const createScene = useMemo(() => {
  //   if (wrapperRef) {
  //     init(wrapperRef, Object.values(segments), {
  //       wireframe: true,
  //     });
  //   }
  // }, [wrapperRef, segments]);

  useEffect(() => {
    // Kind of a crude way of forcing a rerender when resizing
    // the window so we can redraw the canvas
    // THIS NEEDS TO BE FIXED (garbage collector doesn't work properly)
    let handleResize: any;

    console.log(wrapperRef);
    if (wrapperRef) {
      console.log("useEffect");
      handleResize = () => setWrapperRef(null);
      init(wrapperRef, Object.values(segments), {
        wireframe: true,
      });
      window.addEventListener("resize", handleResize);
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
