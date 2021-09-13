import { FC, useContext, MouseEvent as RME } from "react";

import { PIXEL_VALUES, GLOBAL_REFS } from "./KeyframesContainer";
import { KeyframesContext } from "./utils/KeyframesContext";

type Props = {
  zoom: number;
  index: number;
  id: string;
  keyframe: Keyframe;
  editKeyframe: (id: string, okf: Keyframe, nkf: Keyframe) => void;
};

const Keyframe: FC<Props> = ({ zoom, index, id, keyframe, editKeyframe }) => {
  const context = useContext(KeyframesContext);
  const { start, length } = keyframe;
  const { label, second } = PIXEL_VALUES;
  const { keyframeTracks } = GLOBAL_REFS;

  const handleMouseEnter = () => {
    context.setKeyframe(id, keyframe);
  };

  const handleMouseLeave = () => {
    context.clearKeyframe();
  };

  const handleMouseDown = (e: RME<Div>) => {
    const current = e.currentTarget;
    const parent = current.parentElement;
    if (!parent) {
      throw Error("No parent found on Keyframe event handler");
    }
    const offset = e.clientX - current.getBoundingClientRect().left;
    const parentWidth = parent.getBoundingClientRect().width;
    const currentWidth = current.getBoundingClientRect().width;
    const newKeyframe = { ...keyframe };

    const MouseMove = (emove: MouseEvent): any => {
      const { clientX } = emove;
      const { scrollLeft } = keyframeTracks;
      const newStart =
        Math.round(
          ((clientX + scrollLeft - offset - label) / second / zoom) * 100
        ) / 100;
      const formatStart = newStart > 0 ? newStart : 0.01;

      if (clientX + scrollLeft + currentWidth > parentWidth) {
        const tracks = document.querySelectorAll(".track");
        for (let i = 0; i < tracks.length; i++) {
          if (tracks[i]) {
            const elm = tracks[i] as Div;
            elm.style.width = clientX + scrollLeft + currentWidth + "px";
          }
        }
        // reset size should happen during MouseUp
      } else {
        const tracks = document.querySelectorAll(".track");
        for (let i = 0; i < tracks.length; i++) {
          if (tracks[i]) {
            const elm = tracks[i] as Div;
            elm.style.width = "";
          }
        }
      }

      current.style.left = formatStart * second * zoom + label + "px";

      newKeyframe.start = formatStart;
      context.hardSetKeyframe(id, newKeyframe);
    };

    const MouseUp = (eup: MouseEvent) => {
      editKeyframe(id, keyframe, newKeyframe);
      context.hardSetKeyframe(id, newKeyframe);

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
      context.hardSetKeyframe(id, newKeyframe);
    };

    const MouseUp = (eup: MouseEvent) => {
      editKeyframe(id, keyframe, newKeyframe);
      context.hardSetKeyframe(id, newKeyframe);

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
      context.hardSetKeyframe(id, newKeyframe);
    };

    const MouseUp = (eup: MouseEvent) => {
      editKeyframe(id, keyframe, newKeyframe);
      context.hardSetKeyframe(id, newKeyframe);

      document.querySelector("body")!.style.cursor = "";
      document.removeEventListener("mousemove", MouseMove);
      document.removeEventListener("mouseup", MouseUp);
    };

    // Cursor constantly changes during drag, impacts performace pretty heavily
    document.querySelector("body")!.style.cursor = "col-resize";
    document.addEventListener("mousemove", MouseMove);
    document.addEventListener("mouseup", MouseUp);
  };

  const border = (() => {
    if (context.kfState) {
      const isEqual =
        context.kfState.segmentId === id &&
        context.kfState.keyframe.type === keyframe.type &&
        context.kfState.keyframe.start === keyframe.start &&
        context.kfState.keyframe.length === keyframe.length &&
        context.kfState.keyframe.value === keyframe.value;
      if (isEqual) {
        return "1px solid yellow";
      }
    }
    return "none";
  })();

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="track-kf"
      style={{
        border,
        left: start * second * zoom + label + "px",
        width: length * second * zoom + "px",
      }}
    >
      <div onMouseDown={handleLeftMouseDown} className="kf-extend left"></div>K{" "}
      <div onMouseDown={handleRightMouseDown} className="kf-extend right"></div>
    </div>
  );
};

export default Keyframe;
