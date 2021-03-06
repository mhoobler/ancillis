const projectReducer = (state: ProjectStateType, action: ProjectActionType) => {
  const { type, payload } = action;

  switch (type) {
    case "ADD_SEGMENT": {
      const { selection, name } = payload;
      const len = Object.keys(state.segments).length + 1;
      const newSegment: SegmentType = {
        ...selection,
        id: len.toString(),
        name,
        x: 0,
        y: 0,
        connections: [],
        connections2: {},
        keyframes: [],
      };

      return {
        ...state,
        segments: {
          ...state.segments,
          [len.toString()]: newSegment,
        },
      };
    }

    case "MOVE_SEGMENT": {
      const { id, newCoords } = payload;
      const newSegment = { ...state.segments[id], ...newCoords };

      return {
        ...state,
        segments: {
          ...state.segments,
          [id]: newSegment,
        },
      };
    }

    case "CREATE_CONNECTION": {
      const { toId, fromId, index } = payload;

      // check if this is a valid connection
      const keys = Object.keys(state.segments);
      for (let i = 0; i < keys.length; i++) {
        const conns = state.segments[keys[i]].connections;
        for (let x = 0; x < conns.length; x++) {
          if (conns[x] === toId) {
            console.warn("connection already established");
            return state;
          }
        }
      }

      const newSegment = { ...state.segments[fromId] };
      newSegment.connections[index] = toId;

      return {
        ...state,
        segments: {
          ...state.segments,
          [fromId]: newSegment,
        },
      };
    }

    case "DELETE_SEGMENT": {
      return state;
    }

    // KEYFRAMES
    case "ADD_KEYFRAME": {
      const { id, keyframe } = payload;
      const newSegment = { ...state.segments[id] };
      newSegment.keyframes.push(keyframe);
      console.log(newSegment);
      state.segments[id] = newSegment;

      return { ...state };
    }

    // TODO: Fix This
    case "EDIT_KEYFRAME": {
      console.log("test");
      const { id, oldKeyframe, newKeyframe } = payload;
      const newSegment = { ...state.segments[id] };

      newSegment.keyframes = newSegment.keyframes.map((kf) => {
        if (kf === oldKeyframe) {
          return newKeyframe;
        }
        return kf;
      });

      return {
        ...state,
        segments: {
          ...state.segments,
          [id]: newSegment,
        },
      };
    }

    case "DELETE_KEYFRAME": {
      const { id, keyframe } = payload;
      console.log(id);
      const newSegment = { ...state.segments[id] };
      console.log(newSegment);
      const newKeyframes = newSegment.keyframes.filter((kf) => kf !== keyframe);
      newSegment.keyframes = newKeyframes;

      return {
        ...state,
        segments: {
          ...state.segments,
          [id]: newSegment,
        },
      };
    }

    default:
      return state;
  }
};

export default projectReducer;
