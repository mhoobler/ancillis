import { FC } from "react";

import { Sidebar, CanvasContainer } from "./containers";

import { ProjectProvider } from "./utils/ProjectContext";

import "./Project.scss";

const Project: FC = () => {
  return (
    <ProjectProvider project_id="test">
      <div className="project-container">
        <div className="row">
          <Sidebar />
          <CanvasContainer />
        </div>
      </div>
    </ProjectProvider>
  );
};

export default Project;
