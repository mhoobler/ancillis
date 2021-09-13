import { useContext, useRef } from "react";
import { MouseEvent } from "react";

import { getPathString, redrawPaths } from "./SVGFunctions";
import { ProjectContext } from "../../../utils/ProjectContext";

// Everything here actually manipulates what's on the screen
// with near vanilla JS.
// Keep in mind events are all nested inside MouseDown

const useSegmentDragHandlers = (props: SegmentType) => {
  const { dispatch } = useContext(ProjectContext);
  const positionRef = useRef({ x: 0, y: 0 });
  const pathRef: any = useRef(null);

  // Connector Events
  const connectorMouseDown = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    // Get relevant elements
    const target = e.currentTarget;
    const negativeContainer = target.parentElement;
    const projectContainer = document.getElementById(
      "project-components-container"
    );

    // Get relevant data from elements
    const index = Array.prototype.indexOf.call(
      negativeContainer!.children,
      target
    );
    const conn = props.connections[index];
    const offset = projectContainer!.getBoundingClientRect();
    const rectFrom = target.getBoundingClientRect();

    // Hide current SVG path if exists
    const pathElm = document.getElementById(`path-${props.id}-${conn}`);
    if (pathElm) {
      pathElm.style.display = "hidden";
      pathRef.current = pathElm;
    }
    const newPathElm = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

    // Append new path for mouse move
    newPathElm.setAttribute("stroke", "white");
    newPathElm.setAttribute("fill", "transparent");
    projectContainer!.appendChild(newPathElm);

    // MouseMove
    const connectorMouseMove = (e: any) => {
      const to: [number, number] = [e.clientX - offset.x, e.clientY - offset.y];
      const from: [number, number] = [
        Math.floor(rectFrom.width / 2) + rectFrom.x - offset.x,
        Math.floor(rectFrom.height / 2) + rectFrom.y - offset.y,
      ];
      const pathString = getPathString(from, to);
      newPathElm.setAttribute("d", pathString);
    };

    // MouseUp
    const connectorMouseUp = (e: any) => {
      const upTarget = e.target;
      // Get id of #segment-${id}
      // Will likely need a better solution for selecting container
      const parent = upTarget.parentElement.parentElement;
      const toId = parent.dataset.id;

      // Updating state will create permanent path
      if (
        props.id !== toId &&
        upTarget.className.toString().includes("positive")
      ) {
        dispatch({
          type: "CREATE_CONNECTION",
          payload: { fromId: props.id, toId, index },
        });
      }

      // Cleanup
      newPathElm.remove();
      document.removeEventListener("mouseup", connectorMouseUp);
      document.removeEventListener("mousemove", connectorMouseMove);
    };

    // Execute other events
    document.addEventListener("mouseup", connectorMouseUp);
    document.addEventListener("mousemove", connectorMouseMove);
  };

  // Segment Container Events
  const containerMouseDown = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const target = e.currentTarget;
    const paths = Array.from(document.querySelectorAll(`.path-${props.id}`));
    const position = { x: 0, y: 0 };

    const containerMouseMove = (e: any) => {
      redrawPaths(paths, props.id);
      const projectContainer = document.getElementById(
        "project-components-container"
      );
      const container = target.parentElement;

      if (container && projectContainer) {
        const offset = projectContainer.getBoundingClientRect();
        const contRect = container.getBoundingClientRect();
        position.x = e.clientX - offset.x;
        position.y = e.clientY - offset.y;

        // Move element without updating state
        container.setAttribute("x", (e.clientX - offset.x).toString());
        container.setAttribute("y", (e.clientY - offset.y).toString());

        // Scroll with overflow
        // TODO: improve Y axis
        const scrollX =
          e.clientX + contRect.height > offset.left + offset.width &&
          e.clientX + contRect.height;
        const scrollY =
          e.clientY + contRect.height > offset.top + offset.height &&
          e.clientY + contRect.height;

        projectContainer.scrollTo(scrollX, scrollY);
      }
    };

    const containerMouseUp = (e: any) => {
      // Handle dispatch
      console.log(positionRef.current);
      const newSegment = {
        ...props,
        x: positionRef.current.x,
        y: positionRef.current.y,
      };
      dispatch({ type: "MOVE_SEGMENT", payload: newSegment });

      // Reset ref and cleanup event listeners
      document.removeEventListener("mouseup", containerMouseUp);
      document.removeEventListener("mousemove", containerMouseMove);
    };

    document.addEventListener("mouseup", containerMouseUp);
    document.addEventListener("mousemove", containerMouseMove);
  };

  return { connectorMouseDown, containerMouseDown };
};

export default useSegmentDragHandlers;
