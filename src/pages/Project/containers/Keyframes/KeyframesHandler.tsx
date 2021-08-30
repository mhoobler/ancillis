import { FC, useState, useCallback } from "react";

import Toolbar from "./Toolbar";
import TracksContainer from "./TracksContainer";

type Props = {
  trackDataArray: TrackData[];
  addKeyframe: (id: string, kf: Keyframe) => void;
  editKeyframe: (id: string, okf: Keyframe, nkf: Keyframe) => void;
  deleteKeyframe: (id: string, kf: Keyframe) => void;
};

const KeyframesHandler: FC<Props> = ({
  trackDataArray,
  addKeyframe,
  editKeyframe,
  deleteKeyframe,
}) => {
  const [zoom, setZoom] = useState(1);
  const [refState, setRefState]: any = useState({ current: null });

  const wheelEvent = (e: any) => {
    if (e.deltaY < 0) {
      return setZoom(Math.round((zoom + 0.1) * 10) / 10);
    }
    if (e.deltaY > 0 && zoom > 0.1) {
      return setZoom(Math.round((zoom - 0.1) * 10) / 10);
    }
  };

  const handleRef = useCallback((e: HTMLDivElement) => {
    setRefState({ current: e });
  }, []);

  return (
    <div onWheel={wheelEvent} ref={handleRef} className="keyframes-handler">
      <Toolbar zoom={zoom} forwardRef={refState} />
      <TracksContainer
        zoom={zoom}
        trackDataArray={trackDataArray}
        editKeyframe={editKeyframe}
        deleteKeyframe={deleteKeyframe}
      />
    </div>
  );
};

export default KeyframesHandler;
