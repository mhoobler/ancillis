import { FC, memo, MouseEvent as RME } from "react";

import { PIXEL_VALUES } from "./KeyframesContainer";

type Props = {
  zoom: number;
  index: number;
  id: string;
  keyframe: Keyframe;
  editKeyframe: (id: string, okf: Keyframe, nkf: Keyframe) => void;
  deleteKeyframe: (id: string, kf: Keyframe) => void;
};

const Keyframe: FC<Props> = ({
  zoom,
  index,
  id,
  keyframe,
  editKeyframe,
  deleteKeyframe,
}) => {
  console.log("kf");
  const { start, length } = keyframe;
  const { label, second } = PIXEL_VALUES;

  const updateToolbar = (
    clear: boolean,
    newStart?: number,
    newLength?: number
  ) => {
    const s = newStart || start;
    const l = newLength || length;

    const toolbar = document.querySelector(".toolbar-keyframe") as Div;

    if (clear) {
      const toolbar = document.querySelector(".toolbar-keyframe") as Div;
      if (toolbar) {
        toolbar.innerText = "";
        return;
      }
    }

    if (toolbar) {
      toolbar.innerText = "";
      toolbar.innerText = `Start: ${s.toFixed(2)} End: ${(s + l).toFixed(2)}`;
      return;
    }

    console.warn("no toolbar was found");
  };

  const handleMouseDown = (e: RME<Div>) => {
    const current = e.currentTarget;
    const offset = e.clientX - current.getBoundingClientRect().left;
    const newKeyframe = { ...keyframe };

    const MouseMove = (emove: MouseEvent): any => {
      const { clientX } = emove;
      const newStart =
        Math.round(((clientX - offset - label) / second / zoom) * 100) / 100;
      const formatStart = newStart > 0 ? newStart : 0.01;

      current.style.left = formatStart * second * zoom + label + "px";

      newKeyframe.start = formatStart;
      updateToolbar(false, formatStart, newKeyframe.length);
    };

    const MouseUp = (eup: MouseEvent) => {
      editKeyframe(id, keyframe, newKeyframe);
      updateToolbar(false, newKeyframe.start, newKeyframe.length);

      document.removeEventListener("mousemove", MouseMove);
      document.removeEventListener("mouseup", MouseUp);
    };

    document.addEventListener("mousemove", MouseMove);
    document.addEventListener("mouseup", MouseUp);
  };

  const handleLeftMouseDown = (e: RME<Div>) => {
    e.stopPropagation();
    const startX = e.clientX;
    const current = e.currentTarget;
    const parent = current.parentElement;
    if (!parent) {
      throw Error("no parent found");
    }

    const newKeyframe = { ...keyframe };
    const startLimit = keyframe.start + keyframe.length;

    const MouseMove = (emove: MouseEvent): any => {
      const { clientX } = emove;
      const newStart =
        Math.round(((clientX - label) / second / zoom) * 100) / 100;
      const newLength =
        Math.round(((startX - clientX) / second / zoom) * 100) / 100 +
        keyframe.length;
      const formatStart =
        newStart > 0 ? (newStart < startLimit ? newStart : startLimit) : 0.01;
      const formatLength = newLength > 0 ? newLength : 0.01;

      parent.style.left = formatStart * second * zoom + label + "px";
      parent.style.width = formatLength * second * zoom + "px";

      newKeyframe.start = formatStart;
      newKeyframe.length = formatLength;
      updateToolbar(false, formatStart, formatLength);
    };

    const MouseUp = (eup: MouseEvent) => {
      editKeyframe(id, keyframe, newKeyframe);
      updateToolbar(false, newKeyframe.start, newKeyframe.length);

      document.querySelector("body")!.style.cursor = "";
      document.removeEventListener("mousemove", MouseMove);
      document.removeEventListener("mouseup", MouseUp);
    };

    // Cursor constantly changes during drag, impacts performace pretty heavily
    document.querySelector("body")!.style.cursor = "col-resize";
    document.addEventListener("mousemove", MouseMove);
    document.addEventListener("mouseup", MouseUp);
  };

  const handleRightMouseDown = (e: RME<Div>) => {
    e.stopPropagation();
    const startX = e.clientX;
    const current = e.currentTarget;
    const parent = current.parentElement;
    if (!parent) {
      throw Error("no parent found");
    }

    const newKeyframe = { ...keyframe };

    const MouseMove = (emove: MouseEvent): any => {
      const { clientX } = emove;
      const newLength = (clientX - startX) / (second * zoom) + keyframe.length;
      const formatLength = newLength > 0 ? newLength : 0.01;

      parent.style.width = formatLength * second * zoom + "px";

      newKeyframe.length = formatLength;
      updateToolbar(false, newKeyframe.start, formatLength);
    };

    const MouseUp = (eup: MouseEvent) => {
      editKeyframe(id, keyframe, newKeyframe);
      updateToolbar(false, newKeyframe.start, newKeyframe.length);

      document.querySelector("body")!.style.cursor = "";
      document.removeEventListener("mousemove", MouseMove);
      document.removeEventListener("mouseup", MouseUp);
    };

    // Cursor constantly changes during drag, impacts performace pretty heavily
    document.querySelector("body")!.style.cursor = "col-resize";
    document.addEventListener("mousemove", MouseMove);
    document.addEventListener("mouseup", MouseUp);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={() => updateToolbar(false)}
      onMouseLeave={() => updateToolbar(true)}
      className="track-kf"
      style={{
        left: start * second * zoom + label + "px",
        width: length * second * zoom + "px",
      }}
    >
      <div onMouseDown={handleLeftMouseDown} className="kf-extend left"></div>K{" "}
      <div onMouseDown={handleRightMouseDown} className="kf-extend right"></div>
    </div>
  );
};

export default memo(Keyframe, (pp: Props, np: Props) => {
  const isEqual = pp.keyframe === np.keyframe && pp.zoom === np.zoom;
  return isEqual;
});
