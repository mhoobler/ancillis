type KFTypes = "rotation[x]" | "rotation[y]" | "rotation[z]";

interface TrackData {
  id: string;
  name: string;
  keyframes: Keyframe[];
}

interface Keyframe {
  type: FKTypes;
  start: number;
  length: number;
  value: number;
}

interface SegmentType {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  connections: string[];
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
