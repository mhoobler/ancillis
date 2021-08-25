interface BaseKeyframe {
  times: number[];
  values: number[];
}

interface NamedKeyframe extends BaseKeyframe {
  name: string;
}

type SegmentType = {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  connections: string[];
  keyframes: BaseKeyframe;
};

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
