import {
  FC,
  createContext,
  MouseEvent as RME,
  useContext,
  useState,
} from "react";
import { ProjectContext } from "../../../utils/ProjectContext";

type KFState = {
  segmentId: string;
  keyframe: Keyframe;
  locked: boolean;
};

const KeyframesContext = createContext<any>({
  kfState: null,
  setKeyframe: () => {},
  editKeyframe: () => {},
  clearKeyframe: () => {},
  lockKeyframe: () => {},
});

const { Provider } = KeyframesContext;

const KeyframesProvider: FC = ({ children }) => {
  const { dispatch } = useContext(ProjectContext);
  const [kfState, setKfState] = useState<KFState | null>(null);

  const editKeyframe = (kf: Keyframe) => {
    if (kfState) {
      const { segmentId, keyframe } = kfState;
      dispatch({
        type: "EDIT_KEYFRAME",
        payload: {
          id: segmentId,
          oldKeyframe: keyframe,
          newKeyframe: kf,
        },
      });

      setKfState({
        ...kfState,
        keyframe: kf,
      });
    }
  };

  const setKeyframe = (id: string, kf: Keyframe) => {
    if (kfState && kfState.locked) {
      return;
    }
    setKfState({
      segmentId: id,
      keyframe: kf,
      locked: false,
    });
  };

  const hardSetKeyframe = (id: string, kf: Keyframe) => {
    setKfState({
      segmentId: id,
      keyframe: kf,
      locked: true,
    });
  };

  const clearKeyframe = () => {
    if (kfState && !kfState.locked) {
      setKfState(null);
    }
  };

  // Dirty way of locking in keyframe for text-based editing in toolbar
  const lockKeyframe = (e: RME<any>) => {
    const target = e.target as HTMLElement;
    console.log(e);
    if (target.tagName !== "INPUT") {
      if (target.classList.contains("track-kf")) {
        if (kfState) {
          const kfs = kfState;
          kfs.locked = true;
          setKfState(kfs);
        }
      } else {
        setKfState(null);
      }
    }
  };

  return (
    <Provider
      value={{
        kfState,
        setKeyframe,
        hardSetKeyframe,
        editKeyframe,
        clearKeyframe,
        lockKeyframe,
      }}
    >
      {children}
    </Provider>
  );
};

export { KeyframesContext, KeyframesProvider };
