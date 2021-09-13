import { FC, useState, MouseEvent as RME } from "react";

import Keyframe from "./Keyframe";
import { PIXEL_VALUES } from "./KeyframesContainer";

type Props = {
  zoom: number;
  trackData: TrackData;
  addKeyframe: (id: string, kf: Keyframe) => void;
  editKeyframe: (id: string, okf: Keyframe, nkf: Keyframe) => void;
};

const Track: FC<Props> = ({ zoom, trackData, addKeyframe, editKeyframe }) => {
  const { label, second } = PIXEL_VALUES;
  const { name, id, keyframes } = trackData;
  const [newKF, setNewKF] = useState<Keyframe | null>(null);

  const handleMouseDown = (e: RME<HTMLDivElement>) => {
    const { className } = e.target as HTMLDivElement;
    if (className === "track-keyframes") {
      const newKeyframe = {
        type: "position.rotation[x]",
        start: Math.round(((e.clientX - label) / second / zoom) * 100) / 100,
        length: 0,
        value: 0,
      };

      const MouseMove = (eMove: MouseEvent) => {
        console.log("e");
        const length =
          Math.round(((eMove.clientX - label) / second / zoom) * 100) / 100 -
          newKeyframe.start;
        setNewKF({
          ...newKeyframe,
          length,
        });
      };

      const MouseUp = (eUp: MouseEvent) => {
        const length =
          Math.round(((eUp.clientX - label) / second / zoom) * 100) / 100 -
          newKeyframe.start;
        addKeyframe(trackData.id, {
          ...newKeyframe,
          length,
        });
        setNewKF(null);
        document.removeEventListener("mousemove", MouseMove);
        document.removeEventListener("mouseup", MouseUp);
      };

      document.addEventListener("mousemove", MouseMove);
      document.addEventListener("mouseup", MouseUp);
    }
  };

  return (
    <div className="track row">
      <div className="track-label">{name}</div>
      <div className="track-keyframes" onMouseDown={handleMouseDown}>
        {keyframes.map((kf: Keyframe, i: number) => (
          <Keyframe
            key={i}
            index={i}
            id={id}
            keyframe={kf}
            editKeyframe={editKeyframe}
            zoom={zoom}
          />
        ))}
        {newKF && (
          <div
            className="track-kf"
            style={{
              left: newKF.start * second * zoom + label + "px",
              width: newKF.length * second * zoom + "px",
            }}
          >
            NewKf
          </div>
        )}
      </div>
    </div>
  );
};

export default Track;
