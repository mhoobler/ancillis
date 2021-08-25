import { FC, useContext } from "react";

import KeyframesHandler from "./KeyframesHandler";
import { ProjectContext } from "../../utils/ProjectContext";

import "./styles.scss";

const KeyframesContainer: FC = () => {
  const { state, dispatch } = useContext(ProjectContext);

  const namedKeyframes: NamedKeyframe[] = Object.keys(state.segments)
    .map((e) => {
      const { times, values } = state.segments[e].keyframes;
      const { name } = state.segments[e];
      return { name, times, values };
    })
    .flat();

  const addKeyframe = (keyframe: NamedKeyframe) => {
    dispatch({ type: "ADD_KEYFRAME", payload: keyframe });
  };

  const editKeyframe = (
    oldKeyframe: NamedKeyframe,
    newKeyframe: NamedKeyframe
  ) => {
    dispatch({ type: "EDIT_KEYFRAME", payload: { oldKeyframe, newKeyframe } });
  };

  const deleteKeyframe = (keyframe: NamedKeyframe) => {
    dispatch({ type: "DELETE_KEYFRAME", payload: keyframe });
  };

  return (
    <div className="keyframes-container">
      <KeyframesHandler
        namedKeyframes={namedKeyframes}
        addKeyframe={addKeyframe}
        deleteKeyframe={deleteKeyframe}
        editKeyframe={editKeyframe}
      />
    </div>
  );
};

export default KeyframesContainer;
