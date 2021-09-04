interface SegmentSelectType {
  id: string;
  type: string;
  animations: KFTypes[];
}

interface SegmentType extends SegmentSelectType {
  name: string;
  x: number;
  y: number;
  isBase: boolean;
  connections: {
    positives: string[];
    negatives: string[];
  };
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
