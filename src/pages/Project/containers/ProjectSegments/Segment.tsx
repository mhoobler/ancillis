import React, { MouseEvent, useState } from "react";
import useSegmentDragHandlers from "./utils/useSegmentDragHandlers";

import { getPathString } from "./utils/SVGFunctions";
import "./Segment.scss";

interface ParentProps {
  id: string;
  x: number;
  y: number;
  type: string;
  name: string;
  connections: string[];
}

interface ChildrenProps extends ParentProps {
  connectorMouseDown: (e: MouseEvent<HTMLElement>) => void;
  name: string;
}

//function isEqual(pp: ParentProps, np: ParentProps) {
//  const compareProps =
//    pp.x === np.x &&
//    pp.name === np.name &&
//    pp.y === np.y &&
//    pp.type === np.type;
//  return compareProps;
//}

const Limb: React.FC<ChildrenProps> = ({ connectorMouseDown, name }) => {
  return (
    <>
      <div className="positive-end center">
        <div className="positive-connector" />
      </div>
      <div>
        <span className="segment-name">{name}</span>
      </div>
      <div className="negative-end center">
        <div onMouseDown={connectorMouseDown} className="negative-connector" />
      </div>
    </>
  );
};

const Socket: React.FC<ChildrenProps> = ({ connectorMouseDown, name }) => {
  return (
    <>
      <div className="positive-end center">
        <div className="positive-connector" />
      </div>
      <div>
        <span className="segment-name">{name}</span>
      </div>
      <div className="negative-end center">
        <div onMouseDown={connectorMouseDown} className="negative-connector" />
      </div>
    </>
  );
};

const DoubleSocket: React.FC<ChildrenProps> = ({
  connectorMouseDown,
  name,
}) => {
  return (
    <>
      <div className="positive-end center">
        <div className="positive-connector" />
      </div>
      <div>
        <span className="segment-name">{name}</span>
      </div>
      <div className="negative-end space-between">
        <div onMouseDown={connectorMouseDown} className="negative-connector" />
        <div onMouseDown={connectorMouseDown} className="negative-connector" />
      </div>
    </>
  );
};

// Finish this, everything should be setup for the string calcuations
const GetPath: React.FC<any> = ({ id, propRef, targetId, index }) => {
  const container = document.getElementById("project-components-container");
  const target = document.getElementById(`segment-${targetId}`);

  if (container && target && propRef) {
    const offset = container.getBoundingClientRect();

    const rectTo = target
      .querySelector(".positive-connector")!
      .getBoundingClientRect();
    const rectFrom = propRef
      .querySelectorAll(".negative-connector")
      [index].getBoundingClientRect();
    const centerTo: [number, number] = [
      Math.floor(rectTo.width / 2) + rectTo.x - offset.x,
      Math.floor(rectTo.height / 2) + rectTo.y - offset.y,
    ];
    const centerFrom: [number, number] = [
      Math.floor(rectFrom.width / 2) + rectFrom.x - offset.x,
      Math.floor(rectFrom.height / 2) + rectFrom.y - offset.y,
    ];

    const pathString = getPathString(centerFrom, centerTo);

    return (
      <path
        id={`path-${id}-${targetId}`}
        className={`path-${id} path-${targetId}`}
        data-from={id}
        data-to={targetId}
        data-index={index}
        d={pathString}
        stroke="white"
        fill="transparent"
      />
    );
  }
  return null;
};

const Segment: React.FC<ParentProps> = ({
  id,
  x,
  y,
  type,
  name,
  connections,
}) => {
  const { connectorMouseDown, containerMouseDown } = useSegmentDragHandlers({
    id,
    x,
    y,
    type,
    name,
    connections,
  });
  const [ref, setRef] = useState(null);

  const onRefChange = (node: any) => {
    setRef(node);
  };

  // Memoization is not working
  const SelectedSegment: any = (() => {
    switch (type) {
      case "LIMB":
        return Limb;
      case "SOCKET":
        return Socket;
      case "DOUBLE_SOCKET":
        return DoubleSocket;
      default:
        throw Error(`segment type of: ${type} not found`);
    }
  })();
  return (
    <>
      <g>
        <foreignObject x={x} y={y} width={120} height={120}>
          <div
            id={`segment-${id}`}
            data-id={id}
            ref={onRefChange}
            onMouseDown={containerMouseDown}
            className="segment-container"
          >
            <SelectedSegment
              type={type}
              name={name}
              connectorMouseDown={connectorMouseDown}
              connections={connections}
            />
          </div>
        </foreignObject>
      </g>
      {connections &&
        connections.map((e: string, i: number) => {
          return (
            e && (
              <GetPath
                key={`${id}-${e}`}
                id={id}
                propRef={ref}
                targetId={e}
                index={i}
              />
            )
          );
        })}
    </>
  );
};

export default Segment;
