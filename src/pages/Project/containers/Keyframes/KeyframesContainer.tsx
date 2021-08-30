import { FC, useContext } from "react";

import KeyframesHandler from "./KeyframesHandler";
import { ProjectContext } from "../../utils/ProjectContext";

import "./styles.scss";

export const PIXEL_VALUES = {
  label: 182,
  second: 60,
};

const KeyframesContainer: FC = () => {
  const { state, dispatch } = useContext(ProjectContext);

  const trackDataArray: TrackData[] = Object.keys(state.segments).map(
    (e: string) => {
      const { name, id, keyframes } = state.segments[e];
      return { name, id, keyframes };
    }
  );

  const addKeyframe = (id: string, keyframe: Keyframe) => {
    dispatch({ type: "ADD_KEYFRAME", payload: keyframe });
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
    dispatch({ type: "DELETE_KEYFRAME", payload: keyframe });
  };

  return (
    <div className="keyframes-container">
      <KeyframesHandler
        trackDataArray={trackDataArray}
        addKeyframe={addKeyframe}
        deleteKeyframe={deleteKeyframe}
        editKeyframe={editKeyframe}
      />
    </div>
  );
};

export default KeyframesContainer;
