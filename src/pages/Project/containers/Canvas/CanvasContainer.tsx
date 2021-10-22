import { FC, useContext } from "react";

import { ProjectContext } from "../../utils/ProjectContext";
import CanvasHandler from "./CanvasHandler";
import Toolbar from "./Toolbar";

const CanvasContainer: FC = () => {
  const { state } = useContext(ProjectContext);

  return (
    <div className="canvas-container">
      <CanvasHandler segments={state.segments} />
      <Toolbar />
    </div>
  );
};

export default CanvasContainer;
