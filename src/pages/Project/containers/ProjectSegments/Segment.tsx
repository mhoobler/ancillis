import { FC, MouseEvent, useState } from "react";
import useSegmentDragHandlers from "./utils/useSegmentDragHandlers";

import { getPathString } from "./utils/SVGFunctions";

interface ParentProps {
  segment: SegmentType;
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

const GetPath: FC<any> = ({ id, propRef, targetId, index }) => {
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

const Segment: React.FC<ParentProps> = ({ segment }) => {
  const { id, x, y, negatives, positives, name, connections } = segment;
  const { connectorMouseDown, containerMouseDown } = useSegmentDragHandlers({
    ...segment,
  });
  const [ref, setRef] = useState(null);

  const onRefChange = (node: any) => {
    setRef(node);
  };

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
            <div className="positive-end center">
              {Array(positives)
                .fill(0)
                .map((_: number, i: number) => {
                  return <div className="positive-connector" key={i} />;
                })}
            </div>
            <div>
              <span className="segment-name">{name}</span>
            </div>
            <div className="negative-end center">
              {Array(negatives)
                .fill(0)
                .map((_: number, i: number) => {
                  return (
                    <div
                      key={i}
                      className="negative-connector"
                      onMouseDown={connectorMouseDown}
                    />
                  );
                })}
            </div>
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
