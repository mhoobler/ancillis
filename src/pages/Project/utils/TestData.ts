const testData: SegmentMap = {
  1: {
    id: "1",
    type: "LIMB",
    name: "Limb1",
    x: 0,
    y: 0,
    isBase: false,
    connections: {
      north1: null,
      south1: null,
    },
    animations: [],
    keyframes: [
      {
        type: "position.rotation[z]",
        start: 1,
        length: 2,
        value: Math.PI,
      },
      {
        type: "position.rotation[x]",
        start: 1,
        length: 2,
        value: Math.PI,
      },
    ],
  },
  2: {
    id: "2",
    type: "SOCKET",
    name: "Socket1",
    x: 0,
    y: 0,
    isBase: false,
    connections: {
      north1: null,
      south1: null,
    },
    animations: [],
    keyframes: [
      {
        type: "position.rotation[z]",
        start: 1,
        length: 2,
        value: Math.PI,
      },
      {
        type: "position.rotation[x]",
        start: 1,
        length: 2,
        value: Math.PI,
      },
    ],
  },
  3: {
    id: "3",
    type: "DOUBLE_SOCKET",
    name: "DoubleSocket1",
    x: 0,
    y: 0,
    isBase: false,
    connections: {
      north1: null,
      north2: null,
      south1: null,
    },
    animations: [],
    keyframes: [
      {
        type: "position.rotation[z]",
        start: 1,
        length: 2,
        value: Math.PI,
      },
      {
        type: "position.rotation[x]",
        start: 1,
        length: 2,
        value: Math.PI,
      },
    ],
  },
};

export default testData;
