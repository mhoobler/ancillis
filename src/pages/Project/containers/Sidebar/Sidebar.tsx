import { FC } from "react";

import { ProjectSegments } from "../";

// Move Toolbar
const Toolbar: FC = () => {
  return (
    <div className="project-sidebar-toolbar">
      <button>Add</button>
    </div>
  );
};

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
