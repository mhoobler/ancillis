import { FC, useContext } from "react";

import KeyframesHandler from "./KeyframesHandler";
import { ProjectContext } from "../../utils/ProjectContext";
import { KeyframesProvider } from "./utils/KeyframesContext";

import "./styles.scss";

export const PIXEL_VALUES = {
  label: 182,
  second: 60,
};

export const GLOBAL_REFS: any = {
  keyframeTracks: null,
};

const KeyframesContainer: FC = () => {
  const { state, dispatch } = useContext(ProjectContext);
  const keys = Object.keys(state.segments);

  const filterKeys: string[] = keys.filter((key) => {
    return Object.keys(state.segments[key].animations).length > 0;
  });
  const trackDataArray: TrackData[] = filterKeys.map((key: string) => {
    const { name, id, keyframes } = state.segments[key];
    return { name, id, keyframes };
  });

  const addKeyframe = (id: string, keyframe: Keyframe) => {
    dispatch({ type: "ADD_KEYFRAME", payload: { id, keyframe } });
  };

  const editKeyframe = (
    id: string,
    oldKeyframe: Keyframe,
    newKeyframe: Keyframe
  ) => {
    dispatch({
      type: "EDIT_KEYFRAME",
      payload: { id, oldKeyframe, newKeyframe },
    });
  };

  const deleteKeyframe = (id: string, keyframe: Keyframe) => {
    dispatch({ type: "DELETE_KEYFRAME", payload: { id, keyframe } });
  };

  return (
    <div className="keyframes-container">
      <KeyframesProvider>
        <KeyframesHandler
          trackDataArray={trackDataArray}
          addKeyframe={addKeyframe}
          deleteKeyframe={deleteKeyframe}
          editKeyframe={editKeyframe}
        />
      </KeyframesProvider>
    </div>
  );
};

export default KeyframesContainer;
