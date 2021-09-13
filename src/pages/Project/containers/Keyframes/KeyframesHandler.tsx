import { FC, useState, useCallback, useContext } from "react";

import Toolbar from "./Toolbar";
import TracksContainer from "./TracksContainer";

import { KeyframesContext } from "./utils/KeyframesContext";

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
  const { lockKeyframe } = useContext(KeyframesContext);
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
    <div
      onWheel={wheelEvent}
      ref={handleRef}
      onClick={lockKeyframe}
      className="keyframes-handler"
    >
      <Toolbar
        zoom={zoom}
        forwardRef={refState}
        deleteKeyframe={deleteKeyframe}
      />
      <TracksContainer
        zoom={zoom}
        trackDataArray={trackDataArray}
        addKeyframe={addKeyframe}
        editKeyframe={editKeyframe}
      />
    </div>
  );
};

export default KeyframesHandler;
