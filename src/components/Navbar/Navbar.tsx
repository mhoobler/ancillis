import { FC } from "react";

import "./styles.scss";

const Navbar: FC = () => {
  // Logo Search Profile should each be their own components ?
  return (
    <nav>
      <div className="nav-left">
        <div>Logo</div>
      </div>
      <div className="nav-right">
        <div>Search</div>
        <div>Profile</div>
      </div>
    </nav>
  );
};

export default Navbar;
