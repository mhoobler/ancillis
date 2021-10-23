type AnimationMap = {
  [key: string]: KFTypes;
};

interface SegmentSelectType {
  id: string;
  type: string;
  animations: AnimationMap;
  isBase: boolean;
  positives: number;
  negatives: number;
  connectors: string[];
  file: string;
}

interface SegmentType extends SegmentSelectType {
  name: string;
  x: number;
  y: number;
  connections: string[];
  connections2: { [key: string]: string | null };
  keyframes: Keyframe[];
}

type KFTypes =
  | "position.rotation[x]"
  | "position.rotation[y]"
  | "position.rotation[z]";

interface Keyframe {
  type: FKTypes;
  start: number;
  length: number;
  value: number;
}

interface TrackData {
  id: string;
  name: string;
  keyframes: Keyframe[];
}

type SegmentMap = { [key: string]: SegmentType };

type ProjectStateType = {
  segments: SegmentMap;
};

type ProjectDispatchType = any;

type ProjectActionType = any;

type ProjectContextType = {
  state: ProjectStateType;
  dispatch: ProjectDipsatchType;
};
