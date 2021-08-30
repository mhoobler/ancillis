import { FC } from "react";

import Keyframe from "./Keyframe";

type Props = {
  zoom: number;
  trackData: TrackData;
  editKeyframe: (id: string, okf: Keyframe, nkf: Keyframe) => void;
  deleteKeyframe: (id: string, kf: Keyframe) => void;
};

const Track: FC<Props> = ({
  zoom,
  trackData,
  editKeyframe,
  deleteKeyframe,
}) => {
  const { name, id, keyframes } = trackData;

  return (
    <div className="track row">
      <div className="track-label">{name}</div>
      {keyframes.map((kf: Keyframe, i: number) => (
        <Keyframe
          key={i}
          index={i}
          id={id}
          keyframe={kf}
          editKeyframe={editKeyframe}
          deleteKeyframe={deleteKeyframe}
          zoom={zoom}
        />
      ))}
    </div>
  );
};

export default Track;
