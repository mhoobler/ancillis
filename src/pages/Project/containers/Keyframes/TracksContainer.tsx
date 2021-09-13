import { FC } from "react";

import { GLOBAL_REFS } from "./KeyframesContainer";
import Track from "./Track";

type Props = {
  zoom: number;
  trackDataArray: TrackData[];
  addKeyframe: (id: string, kf: Keyframe) => void;
  editKeyframe: (id: string, okf: Keyframe, nkf: Keyframe) => void;
};

const TracksContainer: FC<Props> = ({
  zoom,
  trackDataArray,
  addKeyframe,
  editKeyframe,
}) => {
  const assignRef = (e: any) => {
    GLOBAL_REFS.keyframeTracks = e;
  };
  return (
    <div ref={assignRef} className="keyframes-tracks">
      {trackDataArray.map((trackData: TrackData) => {
        return (
          <Track
            key={trackData.id}
            zoom={zoom}
            trackData={trackData}
            addKeyframe={addKeyframe}
            editKeyframe={editKeyframe}
          />
        );
      })}
    </div>
  );
};

export default TracksContainer;
