import { FC } from "react";

type Props = {
  namedKeyframes: NamedKeyframe[];
  editKeyframe: (okf: NamedKeyframe, nkf: NamedKeyframe) => void;
  deleteKeyframe: (kf: NamedKeyframe) => void;
};

const Tracks: FC<Props> = () => {
  return <div className="keyframes-tracks"> Tracks </div>;
};

export default Tracks;
