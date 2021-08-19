import { FC } from "react";

import { Sidebar, Canvas } from "./containers";

import { ProjectProvider } from "./utils/ProjectContext";

import "./Project.scss";

const Project: FC = () => {
  return (
    <ProjectProvider project_id="test">
      <div className="project-container">
        <div className="row">
          <Sidebar />
          <Canvas />
        </div>
      </div>
    </ProjectProvider>
  );
};

export default Project;
