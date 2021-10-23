import testData from "./TestData";
const exampleProject: SegmentMap = {
  1: {
    ...testData[0],
    id: "1",
    name: "Base",
    x: 0,
    y: 0,
    connections: ["2"],
    connections2: {
      female_port_power: null,
      female_port_limb: "2",
    },
    keyframes: [],
  },
  2: {
    ...testData[2],
    name: "RotorPlate",
    id: "2",
    x: 0,
    y: 0,
    connections: [],
    connections2: {
      female_port_limb: "3",
      male_port_limb: "1",
    },
    keyframes: [
      {
        type: "position.rotation[y]",
        start: 1,
        length: 2,
        value: 5 * Math.PI,
      },
      {
        type: "position.rotation[y]",
        start: 1,
        length: 2,
        value: 5 * Math.PI,
      },
    ],
  },
  3: {
    ...testData[3],
    name: "Limb",
    id: "3",
    x: 0,
    y: 0,
    connections: [],
    connections2: {
      female_port_limb: "4",
      male_port_limb: "2",
    },
    keyframes: [],
  },
  4: {
    ...testData[1],
    name: "Hinge",
    id: "4",
    x: 0,
    y: 0,
    connections: [],
    connections2: {
      female_port_limb: "5",
      male_port_limb: "3",
    },
    keyframes: [
      {
        type: "position.rotation[z]",
        start: 1,
        length: 2,
        value: 5 * Math.PI,
      },
      {
        type: "position.rotation[z]",
        start: 1,
        length: 2,
        value: 5 * Math.PI,
      },
    ],
  },
  5: {
    ...testData[3],
    name: "Limb2",
    id: "5",
    x: 0,
    y: 0,
    connections: [],
    connections2: {
      female_port_limb: null,
      male_port_limb: "4",
    },
    keyframes: [
      {
        type: "position.rotation[z]",
        start: 1,
        length: 2,
        value: 5 * Math.PI,
      },
      {
        type: "position.rotation[x]",
        start: 1,
        length: 2,
        value: 5 * Math.PI,
      },
    ],
  },
};

export default exampleProject;
