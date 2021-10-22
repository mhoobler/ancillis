import { lazy, createContext, FC, useReducer } from "react";
import exampleProject from "./ExampleProject";
import projectReducer from "./ProjectReducer";

const initState: ProjectStateType = {
  segments: exampleProject,
};

const ProjectContext = createContext<ProjectContextType>({
  state: initState,
  dispatch: () => {},
});
const { Provider } = ProjectContext;

type Props = {
  project_id: string;
};

const ProjectProvider: FC<Props> = ({ project_id, children }) => {
  const [state, dispatch] = useReducer(projectReducer, initState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { ProjectContext, ProjectProvider };
