type x = number;
type y = number;

export const getPathString = (from: [x, y], to: [x, y]): string => {
  const center = [
    Math.floor((to[0] + from[0]) / 2),
    Math.floor((to[1] + from[1]) / 2),
  ];
  const isNeg = [to[0] > from[0] ? 1 : -1, to[1] > from[1] ? 1 : -1];
  const normals = [
    Math.abs(Math.floor(1 * (from[0] - center[0]))),
    Math.abs(Math.floor(1 * (from[1] - center[1]))),
  ];

  const points = [
    `M ${from[0]} ${from[1]}`,

    `L ${from[0]} ${center[1] - isNeg[1] * normals[1]}`,

    `C ${from[0]} ${center[1]}`,
    `${from[0]} ${center[1]}`,
    `${from[0] + isNeg[0] * normals[0]} ${center[1]}`,

    `L ${to[0] - isNeg[0] * normals[0]} ${center[1]}`,

    `C ${to[0]} ${center[1]}`,
    `${to[0]} ${center[1]}`,
    `${to[0]} ${center[1] + isNeg[1] * normals[1]}`,

    `L ${to[0]} ${to[1]}`,
  ];
  return points.join(" ");
};

export const redrawPaths = (pathsArr: any[], id: any) => {
  for (let path of pathsArr) {
    const { index, to, from } = path.dataset;
    const isOrigin = id === from;
    const offset = document
      .getElementById("project-components-container")!
      .getBoundingClientRect();
    const origin = document
      .querySelectorAll(`#segment-${isOrigin ? id : from} .negative-connector`)
      [index].getBoundingClientRect();
    const dest = document
      .querySelector(`#segment-${isOrigin ? to : id} .positive-connector`)!
      .getBoundingClientRect();

    const centerOrigin: [number, number] = [
      Math.floor(origin.width / 2) + origin.x - offset.x,
      Math.floor(origin.height / 2) + origin.y - offset.y,
    ];
    const centerDest: [number, number] = [
      Math.floor(dest.width / 2) + dest.x - offset.x,
      Math.floor(dest.height / 2) + dest.y - offset.y,
    ];

    const pathString = getPathString(centerOrigin, centerDest);
    path.setAttribute("d", pathString);
  }
};
