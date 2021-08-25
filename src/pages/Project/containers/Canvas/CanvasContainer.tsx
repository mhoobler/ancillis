import { FC, useContext } from "react";

import { ProjectContext } from "../../utils/ProjectContext";
import CanvasHandler from "./CanvasHandler";

const CanvasContainer: FC = () => {
  const { state } = useContext(ProjectContext);

  return (
    <div className="canvas-container">
      <CanvasHandler segments={state.segments} />
    </div>
  );
};

export default CanvasContainer;
