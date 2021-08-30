import { FC, useState, useEffect, useCallback } from "react";

type Props = {
  zoom: number;
  forwardRef: any;
};

const Toolbar: FC<Props> = ({ zoom, forwardRef }) => {
  const [mousePosition, setMousePosition] = useState(0.0);
  const { current } = forwardRef;
  // 60 pixels in 1 second
  // we reserve 180px for the track labels and an extra 2px because it ends up looking nicer
  const calcTime = (n: number) => {
    const calc = Math.round(((n - 182) / 60 / zoom) * 100) / 100;
    return calc > 0 ? calc.toFixed(2) : "0.00";
  };

  const handleMouseMove = useCallback((e: any) => {
    setMousePosition(e.clientX);
  }, []);

  useEffect(() => {
    if (current) {
      current.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (current) {
        current.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [zoom, current, handleMouseMove]);
  return (
    <div className="keyframes-toolbar">
      <div className="row">
        <div className="toolbar-zoom">Zoom: {zoom}</div>
        <div className="toolbar-time">Time: {calcTime(mousePosition)}</div>
      </div>
      <div className="row">
        <div className="toolbar-keyframe"></div>
      </div>
    </div>
  );
};

export default Toolbar;
