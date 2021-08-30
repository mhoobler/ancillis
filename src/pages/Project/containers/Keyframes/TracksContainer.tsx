import { FC } from "react";

import Track from "./Track";

type Props = {
  zoom: number;
  trackDataArray: TrackData[];
  editKeyframe: (okf: Keyframe, nkf: Keyframe) => void;
  deleteKeyframe: (kf: Keyframe) => void;
};

const TracksContainer: FC<Props> = ({
  zoom,
  trackDataArray,
  editKeyframe,
  deleteKeyframe,
}) => {
  return (
    <div className="keyframes-tracks">
      {trackDataArray.map((trackData: TrackData) => {
        return (
          <Track
            key={trackData.id}
            zoom={zoom}
            trackData={trackData}
            editKeyframe={editKeyframe}
            deleteKeyframe={deleteKeyframe}
          />
        );
      })}
    </div>
  );
};

export default TracksContainer;
