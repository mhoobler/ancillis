import { FC } from "react";

const Toolbar: FC = () => {
  return (
    <div className="canvas-toolbar">
      <button onClick={() => console.log("t")}> ▶️ </button>
      <button onClick={() => console.log("t")}> ⏸️ </button>
    </div>
  );
};

export default Toolbar;
