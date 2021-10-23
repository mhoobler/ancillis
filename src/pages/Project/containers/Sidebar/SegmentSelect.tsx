import { FC, useState, ChangeEvent, MouseEvent, useContext } from "react";

import { Modal } from "../../../../components";

import { ProjectContext } from "../../utils/ProjectContext";
// testData should be pulled from an axios get request
import testData from "../../utils/TestData";

type Props = {
  handleHide: () => void;
};

const SegmentSelect: FC<Props> = ({ handleHide }) => {
  const { dispatch } = useContext(ProjectContext);
  const [name, setName] = useState<string>("");
  const [selection, setSelection] = useState<SegmentSelectType | null>(null);

  const handleSelect = (segmentSelect: SegmentSelectType) => {
    setSelection(segmentSelect);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "ADD_SEGMENT", payload: { selection, name } });
  };

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    setSelection(null);
    setName("");
  };

  return (
    <Modal handleHide={handleHide}>
      <div className="segment-select-sidebar">
        {selection ? (
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
        {testData.map((segmentSelect: SegmentSelectType, i: number) => {
          return (
            <li
              key={i}
              onClick={() => handleSelect(segmentSelect)}
              className="segment-card"
            >
              {segmentSelect.type}
            </li>
          );
        })}
      </ul>
    </Modal>
  );
};

export default SegmentSelect;
