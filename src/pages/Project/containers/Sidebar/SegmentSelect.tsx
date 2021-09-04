import { FC, useState, ChangeEvent, MouseEvent, useContext } from "react";

import { Modal } from "../../../../components";
import { ProjectContext } from "../../utils/ProjectContext";

type Props = {
  handleHide: () => void;
};

const testSegments: SegmentSelectType[] = [
  {
    id: "1",
    type: "SOCKET",
    animations: ["position.rotation[y]"],
  },
  {
    id: "1",
    type: "DOUBLE_SOCKET",
    animations: ["position.rotation[x]"],
  },
  {
    id: "1",
    type: "LIMB",
    animations: [],
  },
];

const SegmentSelect: FC<Props> = ({ handleHide }) => {
  const { dispatch } = useContext(ProjectContext);
  const [name, setName] = useState<string>("");
  const [segment, setSegment] = useState<SegmentSelectType | null>(null);

  const handleSelect = (segment: SegmentSelectType) => {
    setSegment(segment);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "ADD_SEGMENT", payload: { segment, name } });
  };

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    setSegment(null);
    setName("");
  };

  return (
    <Modal handleHide={handleHide}>
      <div className="segment-select-sidebar">
        {segment ? (
          <>
            <input value={name} onChange={handleChange} />

            <div>TEXT DISPLAY STUFF</div>

            <button onClick={handleSubmit}>Add Segment</button>
            <button onClick={handleClear}>Clear Segment</button>
          </>
        ) : (
          <> No Segment Selected </>
        )}
      </div>
      <ul className="segment-cards-list">
        {testSegments.map((segment: SegmentSelectType, i: number) => {
          return (
            <li
              key={i}
              onClick={() => handleSelect(segment)}
              className="segment-card"
            >
              {segment.type}
            </li>
          );
        })}
        {testSegments.map((segment: SegmentSelectType, i: number) => {
          return (
            <li
              key={i}
              onClick={() => handleSelect(segment)}
              className="segment-card"
            >
              {segment.type}
            </li>
          );
        })}
        {testSegments.map((segment: SegmentSelectType, i: number) => {
          return (
            <li
              key={i}
              onClick={() => handleSelect(segment)}
              className="segment-card"
            >
              {segment.type}
            </li>
          );
        })}
        {testSegments.map((segment: SegmentSelectType, i: number) => {
          return (
            <li
              key={i}
              onClick={() => handleSelect(segment)}
              className="segment-card"
            >
              {segment.type}
            </li>
          );
        })}
      </ul>
    </Modal>
  );
};

export default SegmentSelect;
