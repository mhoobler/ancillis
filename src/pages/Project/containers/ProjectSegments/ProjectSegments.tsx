import React, { useContext } from "react";
import { ProjectContext } from "../../utils/ProjectContext";

import Segment from "./Segment";
import "./styles.scss";

const ProjectSegments: React.FC = () => {
  const { state } = useContext(ProjectContext);

  return (
    <div id="project-components-wrapper">
      <svg id="project-components-container" xmlns="http://www.w3.org/2000/svg">
        {state.segments &&
          Object.keys(state.segments).map((key: string) => {
            const segment: SegmentType = state.segments[key];
            return <Segment segment={segment} key={key} />;
          })}
        {state.segments &&
          Object.keys(state.segments).map((key: string) => {
            const segment = state.segments[key];
            const { id } = segment;
            return segment.connections.map((conn: string) => {
              return (
                conn && (
                  <use key={`${id}-${conn}`} href={`#path-${id}-${conn}`} />
                )
              );
            });
          })}
      </svg>
    </div>
  );
};

export default ProjectSegments;
