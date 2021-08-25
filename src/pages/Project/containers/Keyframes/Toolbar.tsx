import { FC } from "react";

type Props = {
  addKeyframe: (kf: NamedKeyframe) => void;
};

const Toolbar: FC<Props> = () => {
  return (
    <div className="keyframes-toolbar">
      <button>AddKeyframe</button>
    </div>
  );
};

export default Toolbar;
