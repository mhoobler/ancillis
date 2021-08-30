import { FC, useContext } from "react";

import { ProjectContext } from "../../utils/ProjectContext";
import CanvasHandler2 from "./CanvasHandler2";
import Toolbar from "./Toolbar";

const CanvasContainer: FC = () => {
  const { state } = useContext(ProjectContext);

  return (
    <div className="canvas-container">
      <CanvasHandler2 segments={state.segments} />
      <Toolbar />
    </div>
  );
};

export default CanvasContainer;
