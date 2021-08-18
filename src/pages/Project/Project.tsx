import { FC } from "react";

import { Sidebar } from "./containers";

import { ProjectProvider } from "./utils/ProjectContext";

import "./Project.scss";

const Project: FC = () => {
  return (
    <ProjectProvider project_id="test">
      <div className="project-container">
        <Sidebar />
      </div>
    </ProjectProvider>
  );
};

export default Project;
