// testData should be pulled from an axios get request
const testData: SegmentSelectType[] = [
  {
    id: "1",
    type: "BASE",
    isBase: true,
    positives: 0,
    negatives: 1,
    animations: [],
  },
  {
    id: "2",
    type: "HINGE",
    isBase: false,
    positives: 1,
    negatives: 1,
    animations: ["position.rotation[y]"],
  },
  {
    id: "3",
    type: "SERVO",
    isBase: false,
    positives: 1,
    negatives: 1,
    animations: ["position.rotation[x]"],
  },
  {
    id: "3",
    type: "LIMB",
    isBase: false,
    positives: 1,
    negatives: 1,
    animations: [],
  },
];

export default testData;
