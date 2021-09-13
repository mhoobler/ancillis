import { FC } from "react";

import { ProjectSegments } from "../";
import Toolbar from "./Toolbar";

import "./styles.scss";

const Sidebar: FC = () => {
  return (
    <div className="project-sidebar-wrapper">
      <div className="project-sidebar-container">
        <Toolbar />
        <ProjectSegments />
      </div>
      <div className="pageStyles panel-edge-right"></div>
    </div>
  );
};

export default Sidebar;
