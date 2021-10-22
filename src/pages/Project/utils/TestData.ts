// testData should be pulled from an axios get request
const testData: SegmentSelectType[] = [
  {
    id: "1",
    type: "BASE",
    isBase: true,
    positives: 0,
    negatives: 1,
    animations: [],
    connectors: ["female_port_power", "female_port_limb"],
    file: "test_base.gltf",
  },
  {
    id: "2",
    type: "ROTOR_HINGE",
    isBase: false,
    positives: 1,
    negatives: 1,
    animations: ["position.rotation[y]"],
    connectors: ["male_port_limb", "female_port_limb"],
    file: "rotor_cylinder.gltf",
  },
  {
    id: "3",
    type: "ROTOR_PLATE",
    isBase: false,
    positives: 1,
    negatives: 1,
    animations: ["position.rotation[x]"],
    connectors: ["male_port_limb", "female_port_limb"],
    file: "rotor_plate.gltf",
  },
  {
    id: "4",
    type: "LIMB",
    isBase: false,
    positives: 1,
    negatives: 1,
    animations: [],
    connectors: ["male_port_limb", "female_port_limb"],
    file: "test_limb.gltf",
  },
];

export default testData;
