import { FC, useContext } from "react";

import { ProjectContext } from "../../utils/ProjectContext";
import CanvasHandler from "./CanvasHandler";

const CanvasContainer: FC = () => {
  const { state } = useContext(ProjectContext);

  return <CanvasHandler segments={state.segments} />;
};

export default CanvasContainer;
