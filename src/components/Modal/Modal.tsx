import { FC, MouseEvent as ReactMouseEvent, useState, useEffect } from "react";

import "./styles.scss";

type Props = {
  handleHide: () => void;
};

const Modal: FC<Props> = ({ handleHide, children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleOutsideClick = (e: ReactMouseEvent) => {
    if (e.target === e.currentTarget) {
      setShow(false);
      setTimeout(handleHide, 210);
    }
  };

  return (
    <div
      onClick={handleOutsideClick}
      className={`modal-wrapper ${show ? "show" : "hide2"}`}
    >
      <div className={`modal-container ${show ? "show" : "hide2"}`}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
