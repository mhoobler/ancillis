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
    animations: [],
    keyframes: [
      {
        type: "position.rotation[z]",
        start: 2,
        length: 2,
        value: 4 * Math.PI,
      },
      {
        type: "position.rotation[z]",
        start: 1,
        length: 2,
        value: 2 * Math.PI,
      },
      {
        type: "position.rotation[x]",
        start: 1,
        length: 2,
        value: 2 * Math.PI,
      },
    ],
  },
  2: {
    ...testData[2],
    name: "RotorPlate",
    id: "2",
    x: 0,
    y: 0,
    connections: [],
    animations: [],
    connections2: {
      female_port_limb: "3",
      male_port_limb: "1",
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
  3: {
    ...testData[3],
    name: "Limb",
    id: "3",
    x: 0,
    y: 0,
    connections: [],
    animations: [],
    connections2: {
      female_port_limb: "4",
      male_port_limb: "2",
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
  4: {
    ...testData[3],
    name: "Hinge",
    id: "4",
    x: 0,
    y: 0,
    connections: [],
    animations: [],
    connections2: {
      female_port_limb: null,
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
        type: "position.rotation[x]",
        start: 1,
        length: 2,
        value: 5 * Math.PI,
      },
    ],
  },
};

export default exampleProject;
