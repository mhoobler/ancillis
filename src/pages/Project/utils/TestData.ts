const testData: SegmentMap = {
  1: {
    id: "1",
    type: "LIMB",
    name: "Limb1",
    x: 0,
    y: 0,
    connections: [],
    keyframes: [],
  },
  2: {
    id: "2",
    type: "SOCKET",
    name: "Socket1",
    x: 0,
    y: 0,
    connections: [],
    keyframes: [
      {
        type: "position.rotation[z]",
        start: 1,
        length: 1.5,
        value: Math.PI * 0.5,
      },
      {
        type: "position.rotation[x]",
        start: 1.5,
        length: 2,
        value: Math.PI * 0.5,
      },
    ],
  },
  3: {
    id: "3",
    type: "DOUBLE_SOCKET",
    name: "DoubleSocket1",
    x: 0,
    y: 0,
    connections: [],
    keyframes: [],
  },
};

export default testData;
