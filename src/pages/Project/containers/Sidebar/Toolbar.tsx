import { FC, useState } from "react";

import SegmentSelect from "./SegmentSelect";

const Toolbar: FC = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleHide = () => setShow(false);

  return (
    <div className="project-sidebar-toolbar">
      <button onClick={handleShow}>Add</button>
      {show && <SegmentSelect handleHide={handleHide} />}
    </div>
  );
};

export default Toolbar;
