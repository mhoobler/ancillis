import { FC } from "react";

import Toolbar from "./Toolbar";
import Tracks from "./Tracks";

type Props = {
  namedKeyframes: NamedKeyframe[];
  addKeyframe: (kf: NamedKeyframe) => void;
  editKeyframe: (okf: NamedKeyframe, nkf: NamedKeyframe) => void;
  deleteKeyframe: (kf: NamedKeyframe) => void;
};

const KeyframesHandler: FC<Props> = ({
  namedKeyframes,
  addKeyframe,
  editKeyframe,
  deleteKeyframe,
}) => {
  return (
    <div className="keyframes-handler">
      <Toolbar addKeyframe={addKeyframe} />
      <Tracks
        namedKeyframes={namedKeyframes}
        editKeyframe={editKeyframe}
        deleteKeyframe={deleteKeyframe}
      />
    </div>
  );
};

export default KeyframesHandler;
