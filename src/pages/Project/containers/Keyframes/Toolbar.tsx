import { FC, useState, useEffect, useCallback, useContext } from "react";

import { PIXEL_VALUES } from "./KeyframesContainer";
import { KeyframesContext } from "./utils/KeyframesContext";

type Props = {
  zoom: number;
  forwardRef: any;
  deleteKeyframe: (id: string, kf: Keyframe) => void;
};

type InputProps = {
  keyframe: Keyframe;
  handleSubmit: (n: any) => void;
  handleDelete: () => void;
};

const ToolbarInputs: FC<InputProps> = ({
  keyframe,
  handleSubmit,
  handleDelete,
}) => {
  const { start, length, value, type } = keyframe;
  const [inputs, setInputs] = useState({
    start: start.toFixed(2),
    end: (start + length).toFixed(2),
    value: keyframe.value.toFixed(2),
  });

  useEffect(() => {
    if (start || length || value) {
      setInputs({
        start: start.toFixed(2),
        end: (start + length).toFixed(2),
        value: value.toFixed(2),
      });
    }
  }, [start, length, value]);

  const handleChange = (e: any) => {
    const { name, value } = e.currentTarget;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleBlur = () => {
    const start = Math.floor(parseFloat(inputs.start) * 100) / 100;
    const end = Math.floor(parseFloat(inputs.end) * 100) / 100;
    if (start > 0 && end - start > 0) {
      handleSubmit({
        start: start,
        length: end - start,
      });
    } else {
      setInputs({
        start: start.toFixed(2),
        end: (start + length).toFixed(2),
        value: value.toFixed(2),
      });
    }
  };

  const handleEnter = (e: any) => {
    if (e.code === "Enter") {
      e.target.blur();
    }
  };

  return (
    <div className="toolbar-inputs">
      <label htmlFor="keyframe-input-start">Start: </label>
      <input
        id="keyframe-input-start"
        type="number"
        name="start"
        onBlur={handleBlur}
        onKeyUp={handleEnter}
        value={inputs.start}
        onChange={handleChange}
      />
      <label htmlFor="keyframe-input-end">End: </label>
      <input
        id="keyframe-input-end"
        type="number"
        name="end"
        onBlur={handleBlur}
        onKeyUp={handleEnter}
        value={inputs.end}
        onChange={handleChange}
      />
      <label htmlFor="keyframe-input-value">Value: </label>
      <input
        id="keyframe-input-value"
        type="number"
        name="value"
        onBlur={handleBlur}
        onKeyUp={handleEnter}
        value={inputs.value}
        onChange={handleChange}
      />
      <label htmlFor="keyframe-input-type">Type: </label>
      <input id="keyframe-input-type" value={type} type="text" disabled />
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

const Toolbar: FC<Props> = ({ zoom, forwardRef, deleteKeyframe }) => {
  const { kfState, editKeyframe } = useContext(KeyframesContext);
  const [mousePosition, setMousePosition] = useState(0.0);
  const { current } = forwardRef;
  const { label, second } = PIXEL_VALUES;
  // 60 pixels in 1 second
  // we reserve 180px for the track labels and an extra 2px because it ends up looking nicer
  const calcTime = (n: number) => {
    const calc = Math.round(((n - label) / second / zoom) * 100) / 100;
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

  const handleSubmit = (i: any) => {
    const { start, length } = i;
    editKeyframe({
      ...kfState.keyframe,
      start,
      length,
    });
  };

  const handleDelete = () => {
    if (kfState) {
      deleteKeyframe(kfState.segmentId, kfState.keyframe);
    }
  };

  return (
    <div className="keyframes-toolbar">
      <div className="row">
        <div className="toolbar-zoom">Zoom: {zoom}</div>
        <div className="toolbar-time">Time: {calcTime(mousePosition)}</div>
      </div>
      <div className="row">
        {kfState && (
          <ToolbarInputs
            keyframe={kfState.keyframe}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Toolbar;
