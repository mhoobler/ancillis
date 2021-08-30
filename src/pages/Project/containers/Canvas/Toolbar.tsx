import { FC } from "react";

import { playAnimations, pauseAnimations } from "./utils/Apple";

const Toolbar: FC = () => {
  return (
    <div className="canvas-toolbar">
      <button onClick={playAnimations}> ▶️ </button>
      <button onClick={pauseAnimations}> ⏸️ </button>
    </div>
  );
};

export default Toolbar;
